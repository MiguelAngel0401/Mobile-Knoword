import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { RefreshTokenService } from 'src/redis/redis.service';
export declare class AuthService {
    private readonly prisma;
    private jwt;
    private config;
    private emailService;
    private refreshTokenService;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, emailService: EmailService, refreshTokenService: RefreshTokenService);
    registerUser(dto: RegisterDto): Promise<{
        username: string;
        email: string;
        realName: string;
        id: number;
    } | undefined>;
    confirmEmail(token: string): Promise<{
        message: string;
    }>;
    validateUserLogin(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateNewAccessAndRefreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    checkEmailAvailability(email: string): Promise<boolean>;
    checkUsernameAvailability(username: string): Promise<boolean>;
    private generateAccessToken;
    private generateRefreshToken;
}
