import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  TokenDto,
  LoginDto,
  CheckUsernameDto,
  CheckEmailDto,
} from './dto';
import type { Response } from 'express';
import { JwtGuard } from './guards';
import { GetRefreshToken, GetUser } from './decorators';
import { RefreshTokenService } from 'src/redis/redis.service';
import type { UserPayload } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @HttpCode(201)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @HttpCode(200)
  @Get('confirm-email')
  confirmEmail(@Query() query: TokenDto) {
    if (!query.token) throw new Error('Token no proporcionado');
    return this.authService.confirmEmail(query.token);
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.validateUserLogin(dto);

    this.setAccessTokenInCookie(response, accessToken);
    this.setRefreshTokenInCookie(response, refreshToken);

    return {
      message: 'Login exitoso',
    };
  }

  @HttpCode(200)
  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(
    @GetUser() user: UserPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const keysDeleted = await this.refreshTokenService.removeToken(user.sub);
    if (keysDeleted < 1) {
      return { message: 'No se encontró el token de refresco' };
    }
    response.clearCookie('access-token', { path: '/' });
    response.clearCookie('refresh-token', { path: '/' });

    return { message: 'Logout exitoso' };
  }

  @HttpCode(200)
  @Get('refresh-token')
  async refreshAccessToken(
    @GetRefreshToken() refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException('No se encontró el token de refresco');
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.generateNewAccessAndRefreshTokens(refreshToken);

    this.setAccessTokenInCookie(response, accessToken);
    this.setRefreshTokenInCookie(response, newRefreshToken);

    return {
      message: 'Token refrescado exitosamente',
    };
  }

  @HttpCode(200)
  @Get('check-email')
  async checkEmail(@Query() query: CheckEmailDto) {
    const isEmailAvailable = await this.authService.checkEmailAvailability(
      query.email,
    );
    if (!isEmailAvailable) {
      return { message: 'Correo inválido', available: false };
    }
    return { message: 'Correo disponible', available: true };
  }

  @HttpCode(200)
  @Get('check-username')
  async checkUsername(@Query() query: CheckUsernameDto) {
    const isUsernameAvailable =
      await this.authService.checkUsernameAvailability(query.username);
    if (!isUsernameAvailable) {
      return { message: 'Nombre de usuario inválido', available: false };
    }
    return { message: 'Nombre de usuario disponible', available: true };
  }

  private setAccessTokenInCookie(response: Response, accessToken: string) {
    response.cookie('access-token', accessToken, {
      httpOnly: true, // Previene acceso desde JS en el cliente
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15, // 15 minutos
      path: '/', // Disponible en todo el sitio
    });
  }

  private setRefreshTokenInCookie(response: Response, refreshToken: string) {
    // Es buena práctica nombrar la cookie de forma genérica
    response.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
      // El path debe ser global para que se pueda refrescar desde cualquier ruta
      // y para que se pueda borrar correctamente en el logout.
      path: '/',
    });
  }
}
