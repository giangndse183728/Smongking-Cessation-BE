import { Body, Controller, Get, Post, UseGuards, Param, HttpStatus, Delete, Req } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { AddFeedbackDto } from './dto/add-feedback.dto';
import { addFeedbackSchema } from './schema/add-feedback.schema';
import { users } from '@prisma/client';
import { FeedbackResponseDto } from './dto/feedback-response.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/constants/enum';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Add or update feedback for a coach' })
  @ApiBody({
    type: AddFeedbackDto,
    examples: {
      example: {
        summary: 'Add feedback',
        value: {
          coach_id: '123e4567-e89b-12d3-a456-426614174000',
          rating_star: 5,
          comment: 'Great coach, very helpful!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback added or updated successfully',
    type: FeedbackResponseDto,
    schema: {
      example: {
        message: 'Feedback added or updated successfully',
        data: {
          rating_star: 4,
          comment: 'Great coach, very helpful!',
          created_at: '2025-07-22T17:28:58.609Z',
          created_by: '457d2421-d281-4e7b-9ffd-c83e299a53cb',
          updated_at: '2025-07-22T17:29:19.566Z',
          updated_by: '457d2421-d281-4e7b-9ffd-c83e299a53cb',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async addOrUpdateFeedback(
    @GetCurrentUser() user: users,
    @Body(new ZodValidationPipe(addFeedbackSchema)) body: AddFeedbackDto,
  ) {
    return await this.feedbackService.addOrUpdateFeedback(body, user.id);
  }

  @Get(':coachId')
  @ApiOperation({ summary: 'Get feedback for a coach' })
  @ApiParam({ name: 'coachId', description: 'Coach ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Feedback retrieved successfully',
    type: FeedbackResponseDto,
    isArray: true,
    schema: {
      example: {
        message: 'Feedback retrieved successfully',
        data: [
          {
            rating_star: 4,
            comment: 'Great coach, very helpful!',
            created_at: '2025-07-22T17:28:58.609Z',
            created_by: '457d2421-d281-4e7b-9ffd-c83e299a53cb',
            updated_at: '2025-07-22T17:29:19.566Z',
            updated_by: '457d2421-d281-4e7b-9ffd-c83e299a53cb',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No feedback found for this coach',
    schema: {
      example: {
        statusCode: 404,
        message: 'No feedback found for this coach',
        error: 'Not Found',
      },
    },
  })
  async getCoachFeedback(
    @Param('coachId') coachId: string,
  ) {
    return await this.feedbackService.getCoachFeedback(coachId);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete feedback (admin only)' })
  @ApiParam({ name: 'id', description: 'Feedback ID' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteFeedback(
    @Param('id') id: string,
    @GetCurrentUser() user: any,
  ) {
    await this.feedbackService.deleteFeedback(id, user.id);
    return { message: 'Feedback deleted successfully' };
  }
} 