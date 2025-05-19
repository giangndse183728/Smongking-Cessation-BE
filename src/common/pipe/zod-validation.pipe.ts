import { PipeTransform, Injectable, ArgumentMetadata, UnprocessableEntityException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const formattedErrors = result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      throw new UnprocessableEntityException(formattedErrors);
    }
    return result.data;
  }
}
