import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import {
  CreateAchievementDto,
  createAchievementSchema,
} from './dto/create-achievement.dto';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/constants/enum';
import {
  UpdateAchievementDto,
  updateAchievementSchema,
} from './dto/update-achievement.dto';
import { getAchievementSchema } from './schemas/get-achievement.schema';

@Controller('achievements')
@ApiBearerAuth('access-token')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create Achievement' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created Achievement Successfully',
    schema: {
      example: {
        statusCode: HttpStatus.OK,
        msg: 'Success!',
        data: {
          id: 'b3e296dd-b4e6-4a0e-b9d8-a264e8119bd4',
          name: 'No relapse for 7 days',
          description: 'You have kept a 7 day streak of no relapse.',
          image_url:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_type: 'relapse_free_streak',
          threshold_value: '7',
          created_at: '2025-06-13T05:02:58.932Z',
          created_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          updated_at: '2025-06-13T05:02:58.932Z',
          updated_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          deleted_at: null,
          deleted_by: null,
        },
        timestamp: '2025-06-13T05:02:58.999Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-03T09:22:46.208Z',
        path: '/api/v1/posts',
        message: [
          {
            path: 'content',
            message: 'Content is required.',
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-06-03T08:30:02.643Z',
        path: '/api/v1/posts',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
    schema: {
      example: {
        statusCode: 403,
        timestamp: '2025-06-13T05:07:27.642Z',
        path: '/api/v1/achievements',
        message: 'Access denied. Requiring a special role',
        errors: [],
      },
    },
  })
  @ApiBody({ type: CreateAchievementDto })
  async createAchievement(
    @GetCurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(createAchievementSchema))
    body: CreateAchievementDto,
  ) {
    return await this.achievementsService.createAchievement(body, userId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Achievement' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Achievement Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
          name: 'No relapse for 7 days',
          description: 'You have kept a 7 day streak of no relapse.',
          image_url:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_type: 'relapse_free_streak',
          threshold_value: '7',
          created_at: '2025-06-13T05:03:54.293Z',
          created_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          updated_at: '2025-06-13T05:56:36.215Z',
          updated_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          deleted_at: null,
          deleted_by: null,
        },
        timestamp: '2025-06-13T05:56:36.565Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-03T09:22:46.208Z',
        path: '/api/v1/posts',
        message: [
          {
            path: 'content',
            message: 'Content is required.',
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-06-03T08:30:02.643Z',
        path: '/api/v1/posts',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
    schema: {
      example: {
        statusCode: 403,
        timestamp: '2025-06-13T05:07:27.642Z',
        path: '/api/v1/achievements',
        message: 'Access denied. Requiring a special role',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Achievement not found',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-06-13T06:37:29.106Z',
        path: '/api/v1/achievements/09b314be-1a19-4c31-9b06-898bfb9cd2ba',
        message: 'Achievement not found.',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Achievement id to update',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  @ApiBody({ type: UpdateAchievementDto })
  async updateAchievement(
    @GetCurrentUser('id') userId: string,
    @Param(new ZodValidationPipe(getAchievementSchema)) params: { id: string },
    @Body(new ZodValidationPipe(updateAchievementSchema))
    body: UpdateAchievementDto,
  ) {
    return await this.achievementsService.updateAchievement(
      params.id,
      body,
      userId,
    );
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Achievement' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete Achievement Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
          name: 'No relapse for 7 days',
          description: 'You have kept a 7 day streak of no relapse.',
          image_url:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_type: 'relapse_free_streak',
          threshold_value: '7',
          created_at: '2025-06-13T05:03:54.293Z',
          created_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          updated_at: '2025-06-13T05:56:36.215Z',
          updated_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          deleted_at: '2025-06-13T05:08:54.293Z',
          deleted_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
        },
        timestamp: '2025-06-13T05:56:36.565Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-03T09:22:46.208Z',
        path: '/api/v1/posts',
        message: [
          {
            path: 'content',
            message: 'Content is required.',
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-06-03T08:30:02.643Z',
        path: '/api/v1/posts',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
    schema: {
      example: {
        statusCode: 403,
        timestamp: '2025-06-13T05:07:27.642Z',
        path: '/api/v1/achievements',
        message: 'Access denied. Requiring a special role',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Achievement not found',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-06-13T06:37:29.106Z',
        path: '/api/v1/achievements/09b314be-1a19-4c31-9b06-898bfb9cd2ba',
        message: 'Achievement not found.',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Achievement id to delete',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  async deleteAchievement(
    @GetCurrentUser('id') userId: string,
    @Param(new ZodValidationPipe(getAchievementSchema)) params: { id: string },
  ) {
    return await this.achievementsService.deleteAchievement(params.id, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Achievement detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Achievement Detail Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
          name: 'No relapse for 7 days',
          description: 'You have kept a 7 day streak of no relapse.',
          image_url:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_type: 'relapse_free_streak',
          threshold_value: '7',
          created_at: '2025-06-13T05:03:54.293Z',
          created_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          updated_at: '2025-06-13T05:56:36.215Z',
          updated_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          deleted_at: '2025-06-13T05:08:54.293Z',
          deleted_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
        },
        timestamp: '2025-06-13T05:56:36.565Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Achievement not found',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-06-13T06:37:29.106Z',
        path: '/api/v1/achievements/09b314be-1a19-4c31-9b06-898bfb9cd2ba',
        message: 'Achievement not found.',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Achievement id to get detail',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  async getAchievementDetail(
    @Param(new ZodValidationPipe(getAchievementSchema)) params: { id: string },
  ) {
    return await this.achievementsService.getAchievement(params.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get Achievements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Achievement Detail Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
          name: 'No relapse for 7 days',
          description: 'You have kept a 7 day streak of no relapse.',
          image_url:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_type: 'relapse_free_streak',
          threshold_value: '7',
          created_at: '2025-06-13T05:03:54.293Z',
          created_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          updated_at: '2025-06-13T05:56:36.215Z',
          updated_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          deleted_at: '2025-06-13T05:08:54.293Z',
          deleted_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
        },
        timestamp: '2025-06-13T05:56:36.565Z',
      },
    },
  })
  async getAchievements() {
    return await this.achievementsService.getAchievements();
  }
}
