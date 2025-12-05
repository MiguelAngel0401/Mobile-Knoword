"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
const bcrypt = __importStar(require("bcrypt"));
const email_service_1 = require("../email/email.service");
const crypto_1 = require("crypto");
const redis_service_1 = require("../redis/redis.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    emailService;
    refreshTokenService;
    constructor(prisma, jwt, config, emailService, refreshTokenService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;
    }
    async registerUser(dto) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);
        const emailVerificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
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
                    emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    realName: true,
                },
            });
            const { email, realName } = user;
            await this.emailService.sendEmailConfirmation(email, realName, emailVerificationToken);
            return user;
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ForbiddenException('Credentials taken');
            }
        }
    }
    async confirmEmail(token) {
        try {
            const now = new Date();
            const updatedUser = await this.prisma.user.update({
                where: {
                    emailVerificationToken: token,
                    isEmailVerified: false,
                    emailVerificationExpiresAt: {
                        gt: now,
                    },
                },
                data: {
                    isEmailVerified: true,
                    emailVerificationToken: null,
                    emailVerificationExpiresAt: null,
                },
            });
            if (!updatedUser) {
                throw new common_1.ForbiddenException('Token inválido o expirado');
            }
            return { message: 'Email confirmado exitosamente' };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.ForbiddenException('Token inválido o expirado');
            }
            throw new Error('Error inesperado al confirmar el email');
        }
    }
    async validateUserLogin(dto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                    isEmailVerified: true,
                },
            });
            if (!user) {
                throw new common_1.ForbiddenException('Email inválido');
            }
            const passwordMatches = await bcrypt.compare(dto.password, user.password);
            if (!passwordMatches) {
                throw new common_1.ForbiddenException('Credenciales inválidas');
            }
            const validatedUser = {
                id: user.id,
            };
            const [accessToken, refreshToken] = await Promise.all([
                this.generateAccessToken(validatedUser),
                this.generateRefreshToken(validatedUser),
            ]);
            const refreshTokenTtlInSeconds = 30 * 24 * 60 * 60;
            await this.refreshTokenService.storeToken(validatedUser.id, refreshToken, refreshTokenTtlInSeconds);
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new Error('Error inesperado al iniciar sesión');
        }
    }
    async generateNewAccessAndRefreshTokens(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Token no proporcionado');
        }
        let payload;
        try {
            payload = await this.jwt.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_SECRET'),
            });
        }
        catch {
            throw new common_1.ForbiddenException('Token de refresco inválido o expirado');
        }
        const userId = payload.sub;
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Acceso Denegado');
        }
        const storedRefreshToken = await this.refreshTokenService.findToken(userId);
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            await this.refreshTokenService.removeToken(userId);
            throw new common_1.ForbiddenException('El token de refresco ha sido revocado');
        }
        const validatedUser = {
            id: user.id,
        };
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.generateAccessToken(validatedUser),
            this.generateRefreshToken(validatedUser),
        ]);
        const refreshTokenTtlInSeconds = 30 * 24 * 60 * 60;
        await this.refreshTokenService.storeToken(validatedUser.id, newRefreshToken, refreshTokenTtlInSeconds);
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    async checkEmailAvailability(email) {
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
    async checkUsernameAvailability(username) {
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
    async generateAccessToken(user) {
        return this.jwt.signAsync({
            sub: user.id,
        }, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });
    }
    async generateRefreshToken(user) {
        return this.jwt.signAsync({
            sub: user.id,
        }, {
            expiresIn: '30d',
            secret: this.config.get('JWT_SECRET'),
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService,
        redis_service_1.RefreshTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map