import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { UsersService } from './users.service';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.schema';
import { UpdateMeDto, updateMeSchema } from './dto/update-user.schema';
import { UserEntity } from './entities/users.entity';
import { users } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('users')
@ApiBearerAuth('access-token')
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
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update me success',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async update(
    @GetCurrentUser() user: users,
    @Body(new ZodValidationPipe(updateMeSchema)) body: UpdateMeDto,
  ) {
    await this.usersService.checkDuplicateFields(user.id, body, [
      'phone_number',
      'email',
    ]);

    return await this.usersService.update(user.id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
