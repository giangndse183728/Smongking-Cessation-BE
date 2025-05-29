import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { users } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: SignupDto & { password: string }): Promise<users> {
    return this.prisma.users.create({
      data,
    });
  }

  async findUserByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<users> {
    return this.prisma.users.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }
}
