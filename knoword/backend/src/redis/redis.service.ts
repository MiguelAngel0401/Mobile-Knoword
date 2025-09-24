import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async storeToken(
    userId: number,
    refreshToken: string,
    ttl: number,
  ): Promise<void> {
    await this.redisClient.set(
      `refreshToken:${userId}`,
      refreshToken,
      'EX',
      ttl,
    );
  }

  async findToken(userId: number): Promise<string | null> {
    return this.redisClient.get(`refreshToken:${userId}`);
  }

  async removeToken(userId: number): Promise<number> {
    // El comando DEL de Redis devuelve el número de claves que se eliminaron.
    // Devolvemos este número para que quien llama pueda verificar si la clave existía.
    // await this.redisClient.del(`refreshToken:${userId}`);
    return this.redisClient.del(`refreshToken:${userId}`);
  }
}
