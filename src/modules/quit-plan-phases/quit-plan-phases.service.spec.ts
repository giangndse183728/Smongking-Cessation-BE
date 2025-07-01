import { Test, TestingModule } from '@nestjs/testing';
import { QuitPlanPhasesService } from './quit-plan-phases.service';

describe('QuitPlanPhasesService', () => {
  let service: QuitPlanPhasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuitPlanPhasesService],
    }).compile();

    service = module.get<QuitPlanPhasesService>(QuitPlanPhasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
