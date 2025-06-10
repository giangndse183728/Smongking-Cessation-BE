import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { hashPassword, comparePassword } from '@common/utils/bcrypt';
import { TokenService } from './token.service';
import { RedisService } from '@libs/redis/redis.service';
import { MailService } from '@libs/mail/mail.service';
import { sendPasswordResetEmail } from '@common/utils/mail.utils';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from '@modules/users/dto/login-google.schema';
import { users } from '@prisma/client';
import { AUTH_MESSAGES } from '@common/constants/messages';
@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private tokenService: TokenService,
    private redisService: RedisService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { password, ...rest } = signupDto;
    const hashedPassword = await hashPassword(password);
    const user = await this.authRepository.createUser({
      ...rest,
      password: hashedPassword,
    });

    const tokens = await this.tokenService.generateTokens(
      user.id,
      user.email,
      user.role,
    );
    return { ...tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(loginDto.email);

    if (!user || !(await comparePassword(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.tokenService.generateTokens(
      user.id,
      user.email,
      user.role,
    );
    return { ...tokens };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const storedToken = await this.redisService.getRefreshToken(userId);

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.tokenService.generateTokens(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.redisService.deleteRefreshToken(userId);
  }

  async forgotPassword(user: users, forgotPasswordDto: ForgotPasswordDto) {
    const resetToken = this.tokenService.generateResetToken();

    const redisKey = `reset-password:${resetToken}`;
    await this.redisService.set(redisKey, user.id, 900);

    await sendPasswordResetEmail(this.mailService, user.email, resetToken);
    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const redisPassKey = `reset-password:${resetPasswordDto.token}`;
    const userId = await this.redisService.get(redisPassKey);

    if (!userId) {
      throw new BadRequestException(
        AUTH_MESSAGES.INVALID_OR_EXPIRED_RESET_TOKEN,
      );
    }

    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(resetPasswordDto.password);

    await this.authRepository.updateUserPassword(user.id, hashedPassword);
    await this.redisService.del(redisPassKey);
    await this.redisService.deleteRefreshToken(user.id);

    return { message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESSFULLY };
  }

  async googleLogin(user: GoogleUser) {
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }

    let dbUser = await this.authRepository.findUserByEmail(user.email);
    if (!dbUser) {
      const hashedPassword = await hashPassword('');
      dbUser = await this.authRepository.createUser({
        email: user.email,
        username: Math.random().toString(36).slice(1, 15),
        first_name: user.first_name,
        last_name: user.last_name,
        password: hashedPassword,
        avatar: user.avatar,
      });
    }

    const tokens = await this.tokenService.generateTokens(
      dbUser.id,
      dbUser.email,
      dbUser.role,
    );
    return tokens;
  }
}
