import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { hashPassword, comparePassword } from '@common/utils/bcrypt';
import { TokenService } from './token.service';
import { RedisService } from '@libs/redis/redis.service';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private redisService: RedisService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { password, ...rest } = signupDto;
    const hashedPassword = await hashPassword(password);
  
    const user = await this.prisma.users.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  
    const tokens = await this.tokenService.generateTokens(user.id, user.email, user.role);
    return { ...tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email },
    });
  
    if (!user || !(await comparePassword(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.tokenService.generateTokens(user.id, user.username, user.role);
    return {  ...tokens };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const storedToken = await this.redisService.getRefreshToken(userId);

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    return this.tokenService.generateTokens(user.id, user.email, user.role);
  }
  
  async logout(userId: number) {
    await this.redisService.deleteRefreshToken(userId);
  }
}
