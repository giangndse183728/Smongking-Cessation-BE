import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { users } from '@prisma/client';

type CreateUserInput = Partial<SignupDto> & {
  avatar?: string;
};
@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserInput): Promise<users> {
    return this.prisma.users.create({
      data: {
        username: data.username as string,
        email: data.email as string,
        password: data.password as string,
        first_name: data.first_name,
        last_name: data.last_name,
        dob: data.dob ? new Date(data.dob) : null,
        phone_number: data.phone_number ?? null,
        avatar: data.avatar ?? '',
      },
    });
  }

  async findUserByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email, deleted_at: null, deleted_by: null },
    });
  }

  async findUserById(id: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { id, deleted_at: null, deleted_by: null },
    });
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<users> {
    return this.prisma.users.update({
      where: { id, deleted_at: null, deleted_by: null },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
        updated_by: id,
      },
    });
  }
}
