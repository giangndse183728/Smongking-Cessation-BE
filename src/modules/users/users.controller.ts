import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { UsersService } from './users.service';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.schema';
import { UpdateUserDto } from './dto/update-user.schema';
import { UserEntity } from './entities/users.entity';
import { users } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getProfile(@GetCurrentUser() user: users) {
    return plainToInstance(UserEntity, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
