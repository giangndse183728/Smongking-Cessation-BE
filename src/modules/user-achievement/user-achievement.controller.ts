import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { UserAchievementService } from './user-achievement.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { getUserAchievementSchema } from './schemas/get-user-ahievement.schema';
import { getUserSchema } from '@modules/users/dto/get-user.schema';

@ApiTags('User Achievements')
@ApiBearerAuth('access-token')
@Controller('user-achievements')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get own user achievements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created Successfully',
    schema: {
      example: {
        statusCode: 201,
        msg: 'Success!',
        data: {
          user_id: 'cc03e440-3bfb-44c5-8c8c-083408c31752',
          type: 'SUCCESS_STORIES',
          title: 'Gary story',
          content: 'HEHE',
          thumbnail:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_id: null,
          created_at: '2025-06-03T08:42:23.028Z',
        },
        timestamp: '2025-06-03T08:42:23.334Z',
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
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  async getUserAchievements(
    @Param(new ZodValidationPipe(getUserAchievementSchema))
    params: {
      id: string;
    },
  ) {
    return await this.userAchievementService.getUserAchievements(params.id);
  }

  @Get(':id/progress')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get own user achievements progress status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Achievement progress status Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: [
          {
            id: '9a6a3656-0816-4935-8185-9d62b5c5f75a',
            name: 'Saved $10!',
            description:
              "Congratulations! You've saved your first $10 by staying smoke-free.",
            image_url:
              'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-money-64-(2)-az2t6ifsy0a0iy9lmdajzjcid.png',
            achievement_type: 'money_saved',
            threshold_value: '10',
            created_at: '2025-06-17T09:17:38.041Z',
            created_by: '50289579-f828-466e-a266-f81adaeb77b9',
            updated_at: '2025-06-26T18:44:53.555Z',
            updated_by: '50289579-f828-466e-a266-f81adaeb77b9',
            deleted_at: null,
            deleted_by: null,
            point: 5,
            progressValue: 30.38,
            isMet: true,
          },
          {
            id: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
            name: 'No relapse for 7 days',
            description: 'You have kept a 7 day streak of no relapse.',
            image_url:
              'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-prize-64-yipva82hckxqapbi3cecatek3.png',
            achievement_type: 'relapse_free_streak',
            threshold_value: '7',
            created_at: '2025-06-13T05:03:54.293Z',
            created_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
            updated_at: '2025-06-26T18:48:36.010Z',
            updated_by: '50289579-f828-466e-a266-f81adaeb77b9',
            deleted_at: null,
            deleted_by: null,
            point: 7,
            progressValue: 0,
            isMet: false,
          },
          {
            id: '7aa328cd-435b-4d27-987f-564139d7a3dc',
            name: 'No relapse for 1 day',
            description: 'You have kept a day streak of no relapse.',
            image_url:
              'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-goal-64-nrdl5qcmc889dp8eqh98sd9g1.png',
            achievement_type: 'relapse_free_streak',
            threshold_value: '1',
            created_at: '2025-06-17T08:19:49.862Z',
            created_by: '50289579-f828-466e-a266-f81adaeb77b9',
            updated_at: '2025-06-26T18:50:16.969Z',
            updated_by: '50289579-f828-466e-a266-f81adaeb77b9',
            deleted_at: null,
            deleted_by: null,
            point: 1,
            progressValue: 0,
            isMet: false,
          },
        ],
        timestamp: '2025-06-27T09:36:16.083Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-06-27T09:49:03.904Z',
        path: '/api/v1/user-achievements/09b314be-1a19-4c31-9b06-898bfb9cd2b5/progress',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        timestamp: '2025-06-27T15:37:07.468Z',
        path: '/api/v1/user-achievements/cd270e95-9d05-48aa-a78b-3b3e0e1e86a4/progress',
        message: 'User not allowed.',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  async getUserAchivementProgressStatus(
    @GetCurrentUser('id') userId: string,
    @Param(new ZodValidationPipe(getUserSchema))
    params: {
      id: string;
    },
  ) {
    return await this.userAchievementService.getAchievementProgressStatus(
      params.id,
      userId,
    );
  }
}
