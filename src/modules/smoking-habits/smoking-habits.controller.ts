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
import {
  CreateSmokingHabitDto,
  createSmokingHabitSchema,
} from './dto/create-smoking-habit.dto';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { SmokingHabitResponseDto } from './dto/res-smoking-habits.dto';
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a smoking habit' })
  @ApiResponse({
    status: 200,
    description: 'The smoking habit has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Smoking habit not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string) {
    return this.smokingHabitsService.remove(id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all smoking habits for current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all smoking habits for the current user.',
    type: [SmokingHabitResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAllCurrentUserHabits(@GetCurrentUser('id') userId: string) {
    return this.smokingHabitsService.findAllByUserId(userId);
  }
}
