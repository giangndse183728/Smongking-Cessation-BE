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
  UsePipes,
  NotFoundException,
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
import { SignupDto } from './dto/signup.dto';
import {
  ForgotPasswordDto,
  forgotPasswordSchema,
} from './dto/forgot-password.dto';
import {
  ResetPasswordDto,
  resetPasswordSchema,
} from './dto/reset-password.dto';
import { Response, Request } from 'express';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetCurrentUser } from 'src/common/decorators/user.decorator';
import { setAuthCookies } from 'src/common/utils/cookies';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { SignupValidationPipe } from '@common/pipe/signup-validation.pipe';
import { GoogleUser } from '@modules/users/dto/login-google.schema';
import { AUTH_MESSAGES } from '@common/constants/messages';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @UsePipes(SignupValidationPipe)
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @ApiBody({ type: SignupDto })
  async signup(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signup(body);
    setAuthCookies(res, refreshToken);
    return { accessToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    setAuthCookies(res, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiCookieAuth()
  async refreshToken(
    @Req() req: Request & { cookies: { refreshToken?: string } },
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUser('userId') userId: string,
  ) {
    const refreshToken: string | undefined = req.cookies?.refreshToken;
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
    @GetCurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'If a user with that email exists, a password reset link has been sent.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AUTH_MESSAGES.USER_NOT_FOUND,
  })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordSchema))
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    const existingUser = await this.usersService.getUser({
      email: forgotPasswordDto.email,
    });
    if (!existingUser) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    return await this.authService.forgotPassword(
      existingUser,
      forgotPasswordDto,
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using a token' })
  @ApiResponse({
    status: 200,
    description: AUTH_MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AUTH_MESSAGES.INVALID_OR_EXPIRED_RESET_TOKEN,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AUTH_MESSAGES.USER_NOT_FOUND,
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema))
    resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 200, description: 'Redirects to Google login page' })
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  async googleAuthCallback(
    @Req() req: Request & { user: GoogleUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.googleLogin(
        req.user as GoogleUser,
      );
      setAuthCookies(res, refreshToken);
      return res.redirect(
        `${this.configService.get<string>('FRONTEND_URL')}/login/success?access_token=${accessToken}`,
      );
    } catch (error) {
      throw new UnauthorizedException('Google login failed');
    }
  }
}
