import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementController } from './user-achievement.controller';

describe('UserAchievementController', () => {
  let controller: UserAchievementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAchievementController],
    }).compile();

    controller = module.get<UserAchievementController>(
      UserAchievementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
