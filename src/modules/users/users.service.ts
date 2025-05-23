import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.schema';
import { UpdateUserDto } from './dto/update-user.schema';
import { UserRole } from '@common/constants/enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDto) {
    return this.prisma.users.create({
      data: {
        ...data,
        role: data.role || UserRole.USER,
      },
    });
  }

  async getUser(filter: Prisma.usersWhereUniqueInput) {
    return await this.prisma.users.findUnique({
      where: filter,
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id },
      data: {
        ...data,
        ...(data.role && { role: data.role }),
        ...(data.status && { status: data.status }),
        updated_at: new Date(),
        updated_by: id,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.users.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
