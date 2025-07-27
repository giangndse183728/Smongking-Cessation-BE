import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SmokingHabitsService } from './smoking-habits.service';
import { CreateSmokingHabitDto } from './dto/create-smoking-habit.dto';
import { SmokingHabitResponseDto } from './dto/res-smoking-habits.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { createSmokingHabitSchema } from './schemas/create-smoking-habit.schema';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';

@ApiTags('Smoking Habits')
@ApiBearerAuth('access-token')
@Controller('smoking-habits')
@UseGuards(AccessTokenGuard)
export class SmokingHabitsController {
  constructor(private readonly smokingHabitsService: SmokingHabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new smoking habit' })
  @ApiResponse({
    status: 201,
    description: 'The smoking habit has been successfully created.',
    type: SmokingHabitResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body(new ZodValidationPipe(createSmokingHabitSchema))
    createSmokingHabitDto: CreateSmokingHabitDto,
    @GetCurrentUser('id') userId: string,
  ) {
    return this.smokingHabitsService.create(createSmokingHabitDto, userId);
  }


  @Get('me')
  @ApiOperation({ summary: 'Get smoking habits for current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns smoking habits for the current user.',
    type: [SmokingHabitResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAllCurrentUserHabits(@GetCurrentUser('id') userId: string) {
    return this.smokingHabitsService.findByUserId(userId);
  }

  @Get('me/has-active-quitplan')
  @ApiOperation({ summary: 'Check if current user has an active quit plan' })
  @ApiResponse({
    status: 200,
    description: 'Returns true if the user has an active quit plan.',
    schema: { example: { hasActiveQuitPlan: true } },
  })
  getHasActiveQuitPlan(@GetCurrentUser('id') userId: string) {
    return this.smokingHabitsService.hasActiveQuitPlan(userId).then(hasActiveQuitPlan => ({
      hasActiveQuitPlan,
    }));
  }
}
