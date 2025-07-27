import { Body, Controller, Post, UsePipes, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { CoachService } from './coach.service';
import { SendCodeDto } from './dto/send-code.dto';
import { CreateCoachDto } from './dto/create-coach.dto';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { createCoachSchema } from './schemas/create-coach.schema';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CoachResponseDto } from './dto/coach-response.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { users } from '@prisma/client';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { updateCoachProfileSchema } from './schemas/create-coach-profile.schema';

@ApiTags('Coach')
@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coaches' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all active coaches retrieved successfully.',
    type: [CoachResponseDto]
  })
  async getAllCoaches(): Promise<CoachResponseDto[]> {
    return this.coachService.getAllCoaches();
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get coach profile' })
  @ApiResponse({
    status: 200,
    description: 'Coach profile retrieved successfully.',
    type: CoachResponseDto,
  })
  async getProfile(@GetCurrentUser() user: users): Promise<CoachResponseDto> {
    return this.coachService.getCoachProfile(user.id);
  }

  @Post('send-code')
  @ApiOperation({ summary: 'Send verification code to coach' })
  @ApiResponse({ status: 201, description: 'Verification code sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({
    type: SendCodeDto,
    examples: {
      example: {
        summary: 'Send code to coach email',
        value: { email: 'coach@example.com', callbackUrl: 'https://your-frontend.com/verify' },
      },
    },
  })
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.coachService.sendVerificationCode(sendCodeDto.email, sendCodeDto.callbackUrl);
  }

  @Post('coach-register')
  @ApiOperation({ summary: 'Register a new coach' })
  @ApiResponse({ status: 201, description: 'Coach registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Verification code not found or expired.' })
  @ApiBody({
    type: CreateCoachDto,
    examples: {
      example: {
        summary: 'Register a new coach',
        value: {
          email: 'coach@example.com',
          userusername: 'John Doe',
          password: 'StrongPassword123',
          phoneNumber:'0937162839',
          code: '123456',
          specialization: 'Smoking Cessation',
          experience_years: 5,
          bio: 'Certified coach with 5 years of experience helping people quit smoking.',
          working_hours: 'Mon-Fri 9:00-17:00',
        },
      },
    },
  })
  @UsePipes(new ZodValidationPipe(createCoachSchema))
  async createCoach(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.createCoach(createCoachDto);
  }


  @Patch('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update current coach profile' })
  @ApiResponse({ status: 200, description: 'Coach profile updated successfully.', type: CoachResponseDto })
  @ApiResponse({ status: 404, description: 'Coach not found.' })
  async updateCurrentCoachProfile(
    @GetCurrentUser() user: users,
    @Body(new ZodValidationPipe(updateCoachProfileSchema)) body: UpdateCoachDto,
  ): Promise<CoachResponseDto> {
    return this.coachService.updateCoachByUserId(user.id, body);
  }
}
