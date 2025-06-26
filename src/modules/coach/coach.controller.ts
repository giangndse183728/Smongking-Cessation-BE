import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CoachService } from './coach.service';
import { SendCodeDto } from './dto/send-code.dto';
import { CreateCoachDto } from './dto/create-coach.dto';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { createCoachSchema } from './schemas/create-coach.schema';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Coach')
@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

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
}
