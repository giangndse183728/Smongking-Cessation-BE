import { Test, TestingModule } from '@nestjs/testing';
import { NotificationSchedulesService } from './notification-schedules.service';

describe('NotificationSchedulesService', () => {
  let service: NotificationSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationSchedulesService],
    }).compile();

    service = module.get<NotificationSchedulesService>(
      NotificationSchedulesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
