import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies';
import { RedisModule } from 'src/redis/redis.module';
import { RefreshTokenService } from 'src/redis/redis.service';

@Module({
  imports: [
    EmailModule,
    PassportModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenService],
})
export class AuthModule {}
