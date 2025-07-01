import { Injectable } from '@nestjs/common';
import { QuitPlanPhasesRepository } from './quit-plan-phases.repository';
import { quit_plan_phases } from '@prisma/client';

@Injectable()
export class QuitPlanPhasesService {
  constructor(
    private readonly quitPlanPhasesRepository: QuitPlanPhasesRepository,
  ) {}
  async getQuitPlanPhases() {
    return this.quitPlanPhasesRepository.getQuitPlanPhases();
  }
  async getQuitPlanPhase(phase_id: string) {
    return this.quitPlanPhasesRepository.getQuitPlanPhase(phase_id);
  }
  async updateQuitPlanPhases(
    phaseId: string,
    status: string,
  ): Promise<quit_plan_phases> {
    return this.quitPlanPhasesRepository.updateQuitPlanPhase(phaseId, status);
  }
}
