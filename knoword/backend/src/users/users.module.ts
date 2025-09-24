import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
