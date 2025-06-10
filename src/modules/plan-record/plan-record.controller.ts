import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PlanRecordService } from './plan-record.service';
import { CreateQuitPlanRecordDto } from './dto/create-plan-record.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';

@Controller('plan-records')
@UseGuards(AccessTokenGuard)
export class PlanRecordController {
  constructor(private readonly planRecordService: PlanRecordService) {}


  @Get(':planId/:phaseId')
  async getRecords(
    @GetCurrentUser('id') userId: string,
    @Param('planId') planId: string,
    @Param('phaseId') phaseId: string,
  ) {
    return this.planRecordService.getRecords(userId, planId, phaseId);
  }

  @Get(':planId')
  async getAllRecords(
    @GetCurrentUser('id') userId: string,
    @Param('planId') planId: string,
  ) {
    return this.planRecordService.getAllRecords(userId, planId);
  }
}
