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
  Query,
} from '@nestjs/common';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { UsersService } from './users.service';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.schema';
import { UpdateMeDto, updateMeSchema } from './dto/update-user.schema';
import { UserEntity } from './entities/users.entity';
import { users } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { PostsService } from '@modules/posts/posts.service';
import { POST_STATUS, UserRole } from '@common/constants/enum';
import { getUserSchema } from './dto/get-user.schema';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getProfile(@GetCurrentUser() user: users) {
    return plainToInstance(UserEntity, user);
  }

  @Roles(UserRole.COACH, UserRole.ADMIN)
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'user id',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  @ApiOperation({ summary: 'Get user by user id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get own posts by status Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          first_name: 'Gia Mỹ',
          last_name: 'Phạm',
          username: 'pgm',
          email: 'pgm@gmail.com',
          password:
            '$2b$10$usBZOrPs7lqvE0Gt7C6.WOtFHp9tCKeNSPcEUgei99bxbctmoiU5K',
          phone_number: '0949309132',
          dob: '2004-10-14T00:00:00.000Z',
          role: 'user',
          created_at: '2025-06-17T05:11:22.120Z',
          created_by: null,
          updated_at: '2025-06-17T05:11:22.120Z',
          updated_by: null,
          deleted_at: null,
          deleted_by: null,
          avatar: '',
          isMember: false,
          user_achievements: [
            {
              id: '9fce7f36-16a8-4c66-b980-1da77b4c4714',
              user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              achievement_id: '87172fea-e7a6-4542-8ead-9962735f33cf',
              earned_date: '2025-06-23T09:41:51.203Z',
              points_earned: 1,
              created_at: '2025-06-23T09:41:51.201Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:41:51.201Z',
              updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              deleted_at: null,
              deleted_by: null,
            },
            {
              id: '9089b93d-6958-42c6-bf24-f3e5ca775ce2',
              user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              achievement_id: '9a6a3656-0816-4935-8185-9d62b5c5f75a',
              earned_date: '2025-06-23T09:41:51.268Z',
              points_earned: 5,
              created_at: '2025-06-23T09:41:51.267Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:41:51.267Z',
              updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              deleted_at: null,
              deleted_by: null,
            },
            {
              id: '8212f613-5b6a-40a9-bb53-eb48ed6d95d1',
              user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              achievement_id: '60cc5512-5bdc-4039-9728-bb2a55b75861',
              earned_date: '2025-06-23T09:41:51.299Z',
              points_earned: 8,
              created_at: '2025-06-23T09:41:51.298Z',
              created_by: 'system',
              updated_at: '2025-06-23T09:41:51.298Z',
              updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
              deleted_at: null,
              deleted_by: null,
            },
          ],
        },
        timestamp: '2025-06-23T14:49:01.444Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'User id is invalid',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-23T14:49:50.065Z',
        path: '/api/v1/users/dc0ef526-ec2b-4ff4-8aa0-308d0c8e499',
        message: [
          {
            path: 'id',
            message: 'User id is invalid.',
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-06-23T14:50:34.088Z',
        path: '/api/v1/users/dc0ef526-ec2b-4ff4-8aa0-308d0c8e4911',
        message: 'User with ID dc0ef526-ec2b-4ff4-8aa0-308d0c8e4911 not found',
        errors: [],
      },
    },
  })
  async findOne(
    @Param(new ZodValidationPipe(getUserSchema)) params: { id: string },
  ) {
    const user = await this.usersService.findOne(params.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${params.id} not found`);
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

  @Get('/me/posts')
  @UseGuards(AccessTokenGuard)
  @ApiQuery({ name: 'status', enum: POST_STATUS, required: false })
  @ApiOperation({ summary: 'Get own posts by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get own posts by status Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: [
          {
            id: '6bcb2b76-a3dc-4481-aa2c-7254ba68ecc9',
            user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
            type: 'tools_and_tips',
            title: 'Medications Can Help You Quit',
            content: 'Medications Can Help You Quit',
            status: 'UPDATING',
            reason: null,
            thumbnail:
              'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
            achievement_id: null,
            created_at: '2025-06-20T00:32:52.129Z',
            created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
            updated_at: '2025-06-20T00:32:52.129Z',
            updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
            deleted_at: null,
            deleted_by: null,
          },
        ],
        timestamp: '2025-06-20T01:19:47.705Z',
      },
    },
  })
  async getOwnPosts(
    @GetCurrentUser('id')
    userId: string,
    @Query('status') status?: string,
  ) {
    return await this.postsService.getOwnPosts(userId, status);
  }
}
