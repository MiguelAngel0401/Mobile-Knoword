import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';
import { UserPayload, UserIdForAccessToken } from './interfaces';
import { RefreshTokenService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const emailVerificationToken = randomBytes(32).toString('hex');
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
          realName: dto.realName,
          avatar: dto.avatar || null,
          bio: dto.bio || null,
          isEmailVerified: false,
          emailVerificationToken,
          emailVerificationExpiresAt: new Date(
            Date.now() + 24 * 60 * 60 * 1000,
          ), // 24 horas
        },
        select: {
          id: true,
          username: true,
          email: true,
          realName: true,
        },
      });
      const { email, realName } = user;
      await this.emailService.sendEmailConfirmation(
        email,
        realName,
        emailVerificationToken,
      );
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken');
      }
    }
  }

  async confirmEmail(token: string) {
    try {
      const now = new Date();
      const updatedUser = await this.prisma.user.update({
        where: {
          emailVerificationToken: token,
          isEmailVerified: false,
          emailVerificationExpiresAt: {
            gt: now, // Verifica que el token no haya expirado
          },
        },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiresAt: null,
        },
      });
      if (!updatedUser) {
        throw new ForbiddenException('Token inválido o expirado');
      }
      return { message: 'Email confirmado exitosamente' };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Token inválido o expirado');
      }
      throw new Error('Error inesperado al confirmar el email');
    }
  }

  async validateUserLogin(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
          isEmailVerified: true,
        },
      });
      if (!user) {
        throw new ForbiddenException('Email inválido');
      }
      const passwordMatches = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatches) {
        throw new ForbiddenException('Credenciales inválidas');
      }
      const validatedUser: UserIdForAccessToken = {
        id: user.id,
      };
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(validatedUser),
        this.generateRefreshToken(validatedUser),
      ]);
      const refreshTokenTtlInSeconds = 30 * 24 * 60 * 60; // 30 dias
      await this.refreshTokenService.storeToken(
        validatedUser.id,
        refreshToken,
        refreshTokenTtlInSeconds,
      );
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error('Error inesperado al iniciar sesión');
    }
  }

  async generateNewAccessAndRefreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    let payload: UserPayload;
    try {
      // Verifica la firma y expiracion del token
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });
    } catch {
      throw new ForbiddenException('Token de refresco inválido o expirado');
    }
    const userId = payload.sub;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ForbiddenException('Acceso Denegado');
    }

    // Verifica si el token existe en redis
    const storedRefreshToken = await this.refreshTokenService.findToken(userId);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      // Medida de seguridad: si se intenta usar un token revocado,
      // invalidamos todos los tokens para ese usuario.
      await this.refreshTokenService.removeToken(userId);
      throw new ForbiddenException('El token de refresco ha sido revocado');
    }

    const validatedUser = {
      id: user.id,
    };
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.generateAccessToken(validatedUser),
      this.generateRefreshToken(validatedUser),
    ]);
    const refreshTokenTtlInSeconds = 30 * 24 * 60 * 60; // 30 dias
    await this.refreshTokenService.storeToken(
      validatedUser.id,
      newRefreshToken,
      refreshTokenTtlInSeconds,
    );
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const emailExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });
    return !emailExists;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const usernameExists = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
      },
    });
    return !usernameExists;
  }

  private async generateAccessToken(
    user: UserIdForAccessToken,
  ): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    );
  }

  private async generateRefreshToken(
    user: UserIdForAccessToken,
  ): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: '30d',
        secret: this.config.get('JWT_SECRET'),
      },
    );
  }
}
