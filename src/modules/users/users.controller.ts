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
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { PostsService } from '@modules/posts/posts.service';
import { POST_STATUS } from '@common/constants/enum';

@Controller('users')
@ApiBearerAuth('access-token')
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
