import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from './redis.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        });
      },
    },
    RefreshTokenService,
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
