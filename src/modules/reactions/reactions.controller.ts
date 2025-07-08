import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { addReactionSchema } from './schema/add-reaction.schema';
import { addReactionDto } from './dto/add-reaction.dto';
import { HttpStatusCode } from 'axios';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { getReactionSchema } from './schema/get-reaction.schema';

@Controller('reactions')
@ApiTags('Reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Add Reaction' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add Reaction Successfully',
    schema: {
      example: {
        statusCode: 201,
        msg: 'Success!',
        data: {
          id: 'a730cf57-45f2-4773-945e-7771bb874ced',
          ref_id: '007456f9-5d43-4346-a02b-ca83ca4c7f40',
          ref_type: 'POST',
          user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          type: 'LIKE',
          created_at: '2025-07-06T11:22:13.225Z',
          created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          updated_at: '2025-07-06T11:22:13.225Z',
          updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          deleted_at: null,
          deleted_by: null,
        },
        timestamp: '2025-07-06T11:22:13.320Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatusCode.Unauthorized,
    description: 'unthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-07-04T01:02:57.680Z',
        path: '/api/v1/notification-schedules',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'malformat of field value',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-07-06T11:23:09.214Z',
        path: '/api/v1/reactions',
        message: [
          {
            path: 'type',
            message: 'Reaction type is invalid.',
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-07-06T11:25:49.925Z',
        path: '/api/v1/reactions',
        message: 'Post not found.',
        errors: [],
      },
    },
  })
  async addReaction(
    @Body(new ZodValidationPipe(addReactionSchema))
    body: addReactionDto,
    @GetCurrentUser('id') userId: string,
  ) {
    return await this.reactionsService.addReaction(userId, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Delete Reaction' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete Reaction Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: 'a730cf57-45f2-4773-945e-7771bb874ced',
          ref_id: '007456f9-5d43-4346-a02b-ca83ca4c7f40',
          ref_type: 'POST',
          user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          type: 'LOVE',
          created_at: '2025-07-06T11:22:13.225Z',
          created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          updated_at: '2025-07-08T03:39:38.882Z',
          updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          deleted_at: '2025-07-08T03:39:38.882Z',
          deleted_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
        },
        timestamp: '2025-07-08T03:39:38.979Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatusCode.Unauthorized,
    description: 'unthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-07-04T01:02:57.680Z',
        path: '/api/v1/notification-schedules',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-07-08T03:40:08.829Z',
        path: '/api/v1/reactions/a730cf57-45f2-4773-945e-7771bb874ced',
        message: 'Reaction not found.',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the post to update',
    example: '4f1e2f17-1f8c-4b63-a74e-7bb176aaed84',
  })
  async deleteReaction(
    @Param(new ZodValidationPipe(getReactionSchema)) params: { id: string },
    @GetCurrentUser('id')
    userId: string,
  ) {
    return await this.reactionsService.deleteReaction(userId, params.id);
  }
}
