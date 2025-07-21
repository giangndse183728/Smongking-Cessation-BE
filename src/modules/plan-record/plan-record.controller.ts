import { Controller, Post, Body, Get, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { PlanRecordService } from './plan-record.service';
import { CreateQuitPlanRecordDto } from './dto/create-plan-record.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { QuitPlanRecordResponseDto } from './dto/quit-plan-record-response.dto';
import { UserRole } from '@common/constants/enum';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Plan Records')
@Controller('plan-records')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
export class PlanRecordController {
  constructor(private readonly planRecordService: PlanRecordService) { }

  @Get(':planId/:phaseId')
  @ApiOperation({ summary: 'Get records for a specific phase in a quit plan' })
  @ApiParam({ name: 'planId', description: 'ID of the quit plan' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Records retrieved successfully',
    type: [QuitPlanRecordResponseDto],
  })
  async getRecords(
    @GetCurrentUser('id') userId: string,
    @Param('planId') planId: string,
    @Param('phaseId') phaseId: string,
  ) {
    return this.planRecordService.getRecords(userId, planId, phaseId);
  }

  @Roles(UserRole.COACH, UserRole.ADMIN)
  @Get('admin/:userId/:planId/:phaseId')
  @ApiOperation({ summary: 'Get records for a specific phase in a quit plan [Coach]' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({ name: 'planId', description: 'ID of the quit plan' })
  @ApiParam({ name: 'phaseId', description: 'ID of the phase' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Records retrieved successfully',
    type: [QuitPlanRecordResponseDto],
  })
  async getRecordsForCoach(
    @Param('userId') userId: string,
    @Param('planId') planId: string,
    @Param('phaseId') phaseId: string,
  ) {
    return this.planRecordService.getRecords(userId, planId, phaseId);
  }

  @Get(':planId')
  @ApiOperation({ summary: 'Get all records for a quit plan' })
  @ApiParam({ name: 'planId', description: 'ID of the quit plan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Records retrieved successfully',
    type: [QuitPlanRecordResponseDto],
  })
  async getAllRecords(
    @GetCurrentUser('id') userId: string,
    @Param('planId') planId: string,
  ) {
    return this.planRecordService.getAllRecords(userId, planId);
  }
}
