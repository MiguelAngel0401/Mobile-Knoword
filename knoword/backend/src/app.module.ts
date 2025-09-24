import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { CommunitiesModule } from './communities/communities.module';
import { AppController } from './app.controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    EmailModule,
    UsersModule,
    RedisModule,
    CommunitiesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
