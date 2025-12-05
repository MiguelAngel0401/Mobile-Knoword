"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const guards_1 = require("./guards");
const decorators_1 = require("./decorators");
const redis_service_1 = require("../redis/redis.service");
let AuthController = class AuthController {
    authService;
    refreshTokenService;
    constructor(authService, refreshTokenService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
    }
    register(dto) {
        return this.authService.registerUser(dto);
    }
    confirmEmail(query) {
        if (!query.token)
            throw new Error('Token no proporcionado');
        return this.authService.confirmEmail(query.token);
    }
    async login(dto, response) {
        const { accessToken, refreshToken } = await this.authService.validateUserLogin(dto);
        this.setAccessTokenInCookie(response, accessToken);
        this.setRefreshTokenInCookie(response, refreshToken);
        return {
            message: 'Login exitoso',
            accessToken,
            refreshToken,
        };
    }
    async logout(user, response) {
        const keysDeleted = await this.refreshTokenService.removeToken(user.sub);
        if (keysDeleted < 1) {
            return { message: 'No se encontró el token de refresco' };
        }
        response.clearCookie('access-token', { path: '/' });
        response.clearCookie('refresh-token', { path: '/' });
        return { message: 'Logout exitoso' };
    }
    async refreshAccessToken(refreshToken, response) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('No se encontró el token de refresco');
        }
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.generateNewAccessAndRefreshTokens(refreshToken);
        this.setAccessTokenInCookie(response, accessToken);
        this.setRefreshTokenInCookie(response, newRefreshToken);
        return {
            message: 'Token refrescado exitosamente',
        };
    }
    async checkEmail(query) {
        const isEmailAvailable = await this.authService.checkEmailAvailability(query.email);
        if (!isEmailAvailable) {
            return { message: 'Correo inválido', available: false };
        }
        return { message: 'Correo disponible', available: true };
    }
    async checkUsername(query) {
        const isUsernameAvailable = await this.authService.checkUsernameAvailability(query.username);
        if (!isUsernameAvailable) {
            return { message: 'Nombre de usuario inválido', available: false };
        }
        return { message: 'Nombre de usuario disponible', available: true };
    }
    setAccessTokenInCookie(response, accessToken) {
        response.cookie('access-token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 15,
            path: '/',
        });
    }
    setRefreshTokenInCookie(response, refreshToken) {
        response.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/',
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('confirm-email'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('refresh-token'),
    __param(0, (0, decorators_1.GetRefreshToken)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshAccessToken", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('check-email'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CheckEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('check-username'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CheckUsernameDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUsername", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        redis_service_1.RefreshTokenService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map