import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MailService } from '@libs/mail/mail.service';
import { RedisService } from '@libs/redis/redis.service';
import { CoachRepository } from './coach.repository';
import { CreateCoachDto } from './dto/create-coach.dto';
import { PrismaService } from '@libs/prisma/prisma.service';
import { AuthService } from '@modules/auth/auth.service';
import { UserRole } from '@common/constants/enum';


@Injectable()
export class CoachService {
  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly coachRepository: CoachRepository,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
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
}
