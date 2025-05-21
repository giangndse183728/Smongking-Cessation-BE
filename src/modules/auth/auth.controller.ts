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
  Get,
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
import { LoginDto, loginSchema } from './dto/login.dto';
import { SignupDto, signupSchema } from './dto/signup.dto';
import { ForgotPasswordDto, forgotPasswordSchema } from './dto/forgot-password.dto';
import { ResetPasswordDto, resetPasswordSchema } from './dto/reset-password.dto';
import { Response, Request } from 'express';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetCurrentUser } from 'src/common/decorators/user.decorator';
import { setAuthCookies } from 'src/common/utils/cookies';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private configService: ConfigService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @ApiBody({ type: SignupDto })
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
  @ApiBody({ type: LoginDto})
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
  @ApiCookieAuth()
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
  @ApiBearerAuth() 
  async logout(
    @GetCurrentUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiResponse({ status: 200, description: 'If a user with that email exists, a password reset link has been sent.' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordSchema)) forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using a token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 200, description: 'Redirects to Google login page' })
  async googleAuth() {
    // This endpoint initiates the Google OAuth flow
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  async googleAuthCallback(
    @Req() req: Request & { user: any },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.googleLogin(req.user);
      setAuthCookies(res, refreshToken);
      return res.redirect(`${this.configService.get<string>('FRONTEND_URL')}/login/success?access_token=${accessToken}`);
    } catch (error) {
      throw new UnauthorizedException('Google login failed');
    }
  }
}
