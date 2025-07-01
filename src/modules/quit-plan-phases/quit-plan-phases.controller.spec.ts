import { Test, TestingModule } from '@nestjs/testing';
import { QuitPlanPhasesController } from './quit-plan-phases.controller';

describe('QuitPlanPhasesController', () => {
  let controller: QuitPlanPhasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuitPlanPhasesController],
    }).compile();

    controller = module.get<QuitPlanPhasesController>(QuitPlanPhasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
