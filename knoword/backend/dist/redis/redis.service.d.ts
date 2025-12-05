import Redis from 'ioredis';
export declare class RefreshTokenService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    storeToken(userId: number, refreshToken: string, ttl: number): Promise<void>;
    findToken(userId: number): Promise<string | null>;
    removeToken(userId: number): Promise<number>;
}
