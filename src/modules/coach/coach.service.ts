import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MailService } from '@libs/mail/mail.service';
import { RedisService } from '@libs/redis/redis.service';
import { CoachRepository } from './coach.repository';
import { CreateCoachDto } from './dto/create-coach.dto';
import { PrismaService } from '@libs/prisma/prisma.service';
import { AuthService } from '@modules/auth/auth.service';
import { UserRole } from '@common/constants/enum';
import { CoachResponseDto } from './dto/coach-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { FeedbackResponseDto } from '../feedback/dto/feedback-response.dto';
import { FeedbackService } from '../feedback/feedback.service';

@Injectable()
export class CoachService {
  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly coachRepository: CoachRepository,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly feedbackService: FeedbackService,
  ) {}

  async sendVerificationCode(email: string, callbackUrl?: string) {
    // Check if user exists
    const existingUser = await this.prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`coach:verify:${email}`, code, 24 * 60 * 60);

    let link = '';
    if (callbackUrl) {
      const url = new URL(callbackUrl);
      url.searchParams.set('email', email);
      url.searchParams.set('code', code);
      link = `<p>Or click <a href="${url.toString()}">here to verify your email</a>.</p>`;
    }

    await this.mailService.sendMail(
      email,
      'Your Coach Registration Code',
      `Your verification code is: ${code}` + (callbackUrl ? `\nVerification link: ${callbackUrl}?email=${email}&code=${code}` : ''),
      `<p>Your verification code is: <b>${code}</b></p>${link}`
    );
    return { message: 'Verification code sent to email' };
  }

  async createCoach(data: CreateCoachDto) {
    const storedCode = await this.redisService.get(`coach:verify:${data.email}`);
    if (!storedCode) {
      throw new NotFoundException('Verification code not found or expired.');
    }

    if (storedCode !== data.code) {
      throw new BadRequestException('Invalid verification code.');
    }

    const signupData: any = {
      username: data.username,
      email: data.email,
      password: data.password,
      phone_number: data.phone_number,
      role: UserRole.COACH
    };
    const tokens = await this.authService.signup(signupData);

    const createdUser = await this.prisma.users.findUnique({ where: { email: data.email } });
    if (!createdUser) {
      throw new BadRequestException('User creation failed');
    }

    const coachProfile = await this.coachRepository.createCoach({
      user_id: createdUser.id,
      specialization: data.specialization,
      experience_years: data.experience_years,
      bio: data.bio,
      working_hours: data.working_hours,
    });

    await this.redisService.del(`coach:verify:${data.email}`);
    return {
      accessToken: tokens.accessToken,
    };
  }

  private calcAverageStars(feedbacks: any[]): { averageStars: { [key: string]: number }, averageRating: number } {
    const averageStars: { [key: string]: number } = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    let total = 0;
    let count = 0;
    for (const fb of feedbacks) {
      const star = String(fb.rating_star);
      if (averageStars[star] !== undefined) {
        averageStars[star] += 1;
        total += fb.rating_star;
        count += 1;
      }
    }
    const averageRating = count ? Number((total / count).toFixed(2)) : 0;
    return { averageStars, averageRating };
  }

  private transformFeedbacks(feedbacks: any[]): FeedbackResponseDto[] {
    return plainToInstance(FeedbackResponseDto, feedbacks, { excludeExtraneousValues: true });
  }

  async getAllCoaches(): Promise<CoachResponseDto[]> {
    try {
      const coaches = await this.coachRepository.findAllCoaches();
      const coachIds = coaches.map((c: any) => c.id);
      const allFeedbacks = await this.feedbackService.getFeedbacksForCoaches(coachIds);
      const feedbacksByCoach: { [coachId: string]: any[] } = {};
      for (const fb of allFeedbacks) {
        if (!feedbacksByCoach[fb.ref_id]) feedbacksByCoach[fb.ref_id] = [];
        feedbacksByCoach[fb.ref_id].push(fb);
      }
      const result = coaches.map((coach: any) => {
        const feedbacks = feedbacksByCoach[coach.id] || [];
        const { averageStars, averageRating } = this.calcAverageStars(feedbacks);
        return {
          ...coach,
          feedbacks: this.transformFeedbacks(feedbacks),
          averageStars,
          averageRating,
        };
      });
      const transformed = plainToInstance(CoachResponseDto, result, { excludeExtraneousValues: true });
      console.log('DEBUG transformed coaches:', JSON.stringify(transformed, null, 2));
      return transformed;
    } catch (error) {
      console.error('Error in getAllCoaches:', error);
      throw error;
    }
  }

  async getCoachProfile(userId: string): Promise<CoachResponseDto> {
    const coach = await this.coachRepository.getCoachProfile(userId);
    if (!coach) {
      throw new NotFoundException('Coach profile not found.');
    }
    const feedbacksRaw = await this.feedbackService.getFeedbacksForCoaches([coach.id]);
    const { averageStars, averageRating } = this.calcAverageStars(feedbacksRaw);
    return plainToInstance(CoachResponseDto, {
      ...coach,
      feedbacks: this.transformFeedbacks(feedbacksRaw),
      averageStars,
      averageRating,
    }, { excludeExtraneousValues: true });
  }

  async updateCoachByUserId(userId: string, data: UpdateCoachDto): Promise<CoachResponseDto> {
    const coach = await this.coachRepository.findActiveCoachByUserId(userId);
    if (!coach) {
      throw new NotFoundException('Coach profile not found.');
    }
    const updatedCoach = await this.coachRepository.updateCoach(coach.id, data);
    return plainToInstance(CoachResponseDto, updatedCoach, {
      excludeExtraneousValues: true,
    });
  }
}
