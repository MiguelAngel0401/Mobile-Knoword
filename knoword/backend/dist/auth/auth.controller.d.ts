import { AuthService } from './auth.service';
import { RegisterDto, TokenDto, LoginDto, CheckUsernameDto, CheckEmailDto } from './dto';
import type { Response } from 'express';
import { RefreshTokenService } from 'src/redis/redis.service';
import type { UserPayload } from './interfaces';
export declare class AuthController {
    private readonly authService;
    private refreshTokenService;
    constructor(authService: AuthService, refreshTokenService: RefreshTokenService);
    register(dto: RegisterDto): Promise<{
        username: string;
        email: string;
        realName: string;
        id: number;
    } | undefined>;
    confirmEmail(query: TokenDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, response: Response): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: UserPayload, response: Response): Promise<{
        message: string;
    }>;
    refreshAccessToken(refreshToken: string, response: Response): Promise<{
        message: string;
    }>;
    checkEmail(query: CheckEmailDto): Promise<{
        message: string;
        available: boolean;
    }>;
    checkUsername(query: CheckUsernameDto): Promise<{
        message: string;
        available: boolean;
    }>;
    private setAccessTokenInCookie;
    private setRefreshTokenInCookie;
}
