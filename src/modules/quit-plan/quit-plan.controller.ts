import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpStatus,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { QuitPlanService } from './quit-plan.service';
import { CreateQuitPlanDto } from './dto/create-quit-plan.dto';
import { createQuitPlanSchema } from './schemas/quit-plan.schema';
import {
  CreateQuitPlanRecordDto,
  createQuitPlanRecordSchema,
} from '../plan-record/dto/create-plan-record.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { QuitPlanResponseDto } from './dto/quit-plan-response.dto';
import { QuitPlanRecordResponseDto } from '../plan-record/dto/quit-plan-record-response.dto';
import { QUIT_PLAN_MESSAGES } from '@common/constants/messages';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/constants/enum';

@ApiTags('Quit Plans')
@Controller('quit-plans')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
export class QuitPlanController {
  constructor(private readonly quitPlanService: QuitPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quit plan with AI-generated phases' })
  @ApiBody({
    type: CreateQuitPlanDto,
    description: 'Data for creating a new quit plan',
    examples: {
      standard: {
        value: {
          reason: 'I want to improve my health',
          plan_type: 'standard',
        },
      },
      aggressive: {
        value: {
          reason: 'I need to quit smoking immediately',
          plan_type: 'aggressive',
        },
      },
      slow: {
        value: {
          reason: 'I want to gradually reduce smoking',
          plan_type: 'slow',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Quit plan created successfully',
    type: QuitPlanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or failed to create quit plan',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Required resources not found',
  })
  async createQuitPlan(
    @GetCurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(createQuitPlanSchema))
    createQuitPlanDto: CreateQuitPlanDto,
  ) {
    try {
      const result = await this.quitPlanService.createQuitPlan(
        userId,
        createQuitPlanDto,
      );
      return {
        success: true,
        message: 'Quit plan created successfully with AI-generated phases',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create quit plan',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('records')
  @ApiOperation({
    summary: 'Create a daily record for the active quit plan phase',
  })
  @ApiBody({
    type: CreateQuitPlanRecordDto,
    description:
      'Data for creating a daily record. The record will be associated with your active quit plan and phase.',
    examples: {
      complete: {
        value: {
          cigarette_smoke: 5,
          craving_level: 7,
          health_status: 'GOOD',
          record_date: new Date(),
        },
      },
      minimal: {
        value: {
          cigarette_smoke: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Daily record created successfully',
    type: QuitPlanRecordResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid input, no active plan found, or failed to create record',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Required resources not found',
  })
  async createQuitPlanRecord(
    @GetCurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(createQuitPlanRecordSchema))
    createQuitPlanRecordDto: CreateQuitPlanRecordDto,
  ) {
    try {
      const result = await this.quitPlanService.createQuitPlanRecord(
        userId,
        createQuitPlanRecordDto,
      );
      return {
        success: true,
        message: 'Daily record created successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create record',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a detail quit plan by ID [Current User]' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quit plan retrieved successfully',
    type: QuitPlanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quit plan not found',
  })
  async getQuitPlanById(
    @GetCurrentUser('id') userId: string,
    @Param('id') planId: string,
  ) {
    const result = await this.quitPlanService.getQuitPlanById(userId, planId);
    if (!result) {
      throw new HttpException(
        {
          success: false,
          message: 'Quit plan not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      success: true,
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all quit plans for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quit plans retrieved successfully',
    type: [QuitPlanResponseDto],
  })
  async getAllQuitPlans(@GetCurrentUser('id') userId: string) {
    try {
      const result = await this.quitPlanService.getAllQuitPlans(userId);
      return {
        success: true,
        message: 'Quit plans retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || QUIT_PLAN_MESSAGES.FAILED_TO_RETRIEVE_PLANS,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quit plan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quit plan deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quit plan not found',
  })
  async deleteQuitPlan(
    @GetCurrentUser('id') userId: string,
    @Param('id') planId: string,
  ) {
    const result = await this.quitPlanService.deleteQuitPlan(userId, planId);
    if (!result) {
      throw new HttpException(
        {
          success: false,
          message: 'Quit plan not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      success: true,
      message: 'Quit plan deleted successfully',
    };
  }

  @Roles(UserRole.COACH, UserRole.ADMIN)
  @Get(':userId/:planId')
  @ApiOperation({ summary: 'Get a quit plan by userId and planId [Coach]' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quit plan retrieved successfully',
    type: QuitPlanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quit plan not found',
  })
  async getQuitPlanByUserAndPlan(
    @Param('userId') userId: string,
    @Param('planId') planId: string,
  ) {
    const result = await this.quitPlanService.getQuitPlanById(userId, planId);
    if (!result) {
      throw new HttpException(
        {
          success: false,
          message: 'Quit plan not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      success: true,
      data: result,
    };
  }
}
