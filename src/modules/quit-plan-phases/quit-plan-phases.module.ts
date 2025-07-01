import { PrismaModule } from '@libs/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { QuitPlanPhasesController } from './quit-plan-phases.controller';
import { QuitPlanPhasesService } from './quit-plan-phases.service';
import { QuitPlanPhasesRepository } from './quit-plan-phases.repository';

@Module({
  imports: [PrismaModule],
  controllers: [QuitPlanPhasesController],
  providers: [QuitPlanPhasesService, QuitPlanPhasesRepository],
  exports: [QuitPlanPhasesService, QuitPlanPhasesRepository],
})
export class QuitPlanPhasesModule {}
