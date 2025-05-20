import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto, LoginDtoSwagger, loginSchema } from './dto/login.dto';
import { SignupDto, SignupDtoSwagger, signupSchema } from './dto/signup.dto';
import { Response, Request } from 'express';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetCurrentUser } from 'src/common/decorators/user.decorator';
import { setAuthCookies } from 'src/common/utils/cookies';

@ApiTags('Auth') // Nhóm các API này dưới tag "Auth" trong Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @ApiBody({ type: SignupDtoSwagger })
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signup(signupDto);
    setAuthCookies(res, refreshToken);
    return { accessToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBody({ type: LoginDtoSwagger})
  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);
    setAuthCookies(res, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
  @ApiCookieAuth() // Đánh dấu là sử dụng cookie (refreshToken)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUser('userId') userId: string,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(userId, refreshToken);
    setAuthCookies(res, newRefreshToken);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Log out the user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiBearerAuth() // Đánh dấu là sử dụng bearer token (accessToken)
  async logout(
    @GetCurrentUser('userId') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
