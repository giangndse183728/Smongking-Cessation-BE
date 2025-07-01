import { Test, TestingModule } from '@nestjs/testing';
import { NotificationSchedulesController } from './notification-schedules.controller';

describe('NotificationSchedulesController', () => {
  let controller: NotificationSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationSchedulesController],
    }).compile();

    controller = module.get<NotificationSchedulesController>(
      NotificationSchedulesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
