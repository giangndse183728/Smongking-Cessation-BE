import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationSchedulesService } from './notification-schedules.service';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { addNotificationScheduleSchema } from './dto/add-notification-schedule.dto';
import { addNotificationScheduleDto } from './schema/add-notification-schedule.schema';
import { GetCurrentUser } from '@common/decorators/user.decorator';

@Controller('notification-schedules')
@ApiTags('notification-schedules')
export class NotificationSchedulesController {
  constructor(
    private readonly notificationSchedulesService: NotificationSchedulesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add Notification Schedule' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add Notification Schedule Successfully',
    schema: {
      example: {},
    },
  })
  async addNotificationSchedule(
    @Body(new ZodValidationPipe(addNotificationScheduleSchema))
    body: addNotificationScheduleDto,
    @GetCurrentUser() userId: string,
  ) {
    return await this.notificationSchedulesService.addNotificationSchedule(
      userId,
      body,
    );
  }
}
