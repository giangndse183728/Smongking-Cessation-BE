import { SignupDto, signupSchema } from '@modules/auth/dto/signup.dto';
import { UsersService } from '@modules/users/users.service';
import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { users } from '@prisma/client';

@Injectable()
export class SignupValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}
  async transform(value: SignupDto, metadata: ArgumentMetadata) {
    const errors: { path: string; message: string }[] = [];
    const result = signupSchema.safeParse(value);

    const invalidFields = new Set<string>();
    if (!result.success) {
      for (const err of result.error.errors) {
        const path = err.path.join('.');
        errors.push({ path, message: err.message });
        invalidFields.add(path);
      }
    }

    const { email, phone_number, username } = value;

    const checks: Promise<users | null>[] = [];

    const shouldCheckEmail = email && !invalidFields.has('email');
    const shouldCheckPhone = phone_number && !invalidFields.has('phone_number');
    const shouldCheckUsername = username && !invalidFields.has('username');

    checks.push(
      shouldCheckEmail
        ? this.usersService.getUser({ email })
        : Promise.resolve(null),
    );

    checks.push(
      shouldCheckPhone
        ? this.usersService.getUser({ phone_number })
        : Promise.resolve(null),
    );
    checks.push(
      shouldCheckUsername
        ? this.usersService.getUser({ username })
        : Promise.resolve(null),
    );

    const [existingEmail, existingPhone, existingUsername] =
      await Promise.all(checks);

    if (shouldCheckEmail && existingEmail) {
      errors.push({ path: 'email', message: 'Email has already existed.' });
    }
    if (shouldCheckPhone && existingPhone) {
      errors.push({
        path: 'phone_number',
        message: 'Phone number already existed.',
      });
    }
    if (shouldCheckUsername && existingUsername) {
      errors.push({
        path: 'username',
        message: 'Username has already existed.',
      });
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        errors,
      });
    }

    return result.success ? result.data : value;
  }
}
