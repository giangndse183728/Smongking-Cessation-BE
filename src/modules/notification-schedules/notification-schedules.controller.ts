import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationSchedulesService } from './notification-schedules.service';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { addNotificationScheduleSchema } from './schema/add-notification-schedule.schema';
import { addNotificationScheduleDto } from './dto/add-notification-schedule.dto';

@Controller('notification-schedules')
@ApiBearerAuth('access-token')
@ApiTags('Notification Schedules')
export class NotificationSchedulesController {
  constructor(
    private readonly notificationSchedulesService: NotificationSchedulesService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Add Notification Schedule' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add Notification Schedule Successfully',
    schema: {
      example: {
        statusCode: 201,
        msg: 'Success!',
        data: {
          id: 'e17e809a-10ed-47db-a31a-b60f2a6049d0',
          user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          type: 'reminder',
          frequency: 'daily',
          preferred_time: '1970-01-01T09:50:00.000Z',
          is_active: true,
          created_at: '2025-07-04T00:57:35.197Z',
          created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          updated_at: '2025-07-04T00:57:35.197Z',
          updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          deleted_at: null,
          deleted_by: null,
        },
        timestamp: '2025-07-04T00:57:35.453Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
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
        timestamp: '2025-07-04T01:01:13.867Z',
        path: '/api/v1/notification-schedules',
        message: [
          {
            path: 'preferred_time',
            message: 'Preferred time is invalid.',
          },
        ],
        errors: [],
      },
    },
  })
  async addNotificationSchedule(
    @Body(new ZodValidationPipe(addNotificationScheduleSchema))
    body: addNotificationScheduleDto,
    @GetCurrentUser('id') userId: string,
  ) {
    return await this.notificationSchedulesService.addNotificationSchedule(
      userId,
      body,
    );
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get Own Notification Schedule' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Notification Schedule Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: 'e17e809a-10ed-47db-a31a-b60f2a6049d0',
          user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          type: 'reminder',
          frequency: 'DAILY',
          preferred_time: '1970-01-01T09:50:00.000Z',
          is_active: true,
          created_at: '2025-07-04T00:57:35.197Z',
          created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          updated_at: '2025-07-04T00:57:35.197Z',
          updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          deleted_at: null,
          deleted_by: null,
        },
        timestamp: '2025-07-06T03:17:45.732Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
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
  async getNotificationScheduleDetail(@GetCurrentUser('id') userId: string) {
    return await this.notificationSchedulesService.getOwnNotificationSchedule(
      userId,
    );
  }
}
