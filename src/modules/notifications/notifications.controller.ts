import { GetCurrentUser } from '@common/decorators/user.decorator';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { HttpStatusCode } from 'axios';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth('access-token')
@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get Notifications' })
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
    status: HttpStatusCode.Ok,
    description: 'Get Notifications Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: [
          {
            id: '66eecd37-dcd9-41a4-a679-24e638c1d8e2',
            user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
            title: 'Quick check-in: Have you recorded today’s cigarettes?',
            content:
              "Great job! You've maintained your cigarette limit streak for 1 days in a row. Stay strong, and don’t forget to fill in today’s record!",
            type: 'REMINDER',
            is_read: false,
            created_at: '2025-07-06T10:27:00.244Z',
            created_by: 'system',
            updated_at: '2025-07-06T10:27:00.244Z',
            updated_by: 'system',
            deleted_at: null,
            deleted_by: null,
          },
        ],
      },
    },
  })
  @Get()
  async getNotifications(@GetCurrentUser('id') userId: string) {
    return await this.notificationsService.getNotifications(userId);
  }
}
