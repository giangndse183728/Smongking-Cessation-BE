import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { quit_plan_phases } from '@prisma/client';

@Injectable()
export class QuitPlanPhasesRepository {
  constructor(private prisma: PrismaService) {}
  async getQuitPlanPhases() {
    return await this.prisma.quit_plan_phases.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
      },
    });
  }
  async getQuitPlanPhase(phaseId: string) {
    return await this.prisma.quit_plan_phases.findUnique({
      where: {
        id: phaseId,
        deleted_at: null,
        deleted_by: null,
      },
    });
  }
  async updateQuitPlanPhase(
    phasesId: string,
    status: string,
  ): Promise<quit_plan_phases> {
    return await this.prisma.quit_plan_phases.update({
      where: { id: phasesId },
      data: { status },
    });
  }
}
