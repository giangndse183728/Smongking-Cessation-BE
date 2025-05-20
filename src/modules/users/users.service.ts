import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.schema';
import { UpdateUserDto } from './dto/update-user.schema';
import { UserRole, Status } from '@common/constants/enum';

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

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id },
      data: {
        ...data,
        ...(data.role && { role: data.role }),
        ...(data.status && { status: data.status })
      },
    });
  }

  async delete(id: string) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
