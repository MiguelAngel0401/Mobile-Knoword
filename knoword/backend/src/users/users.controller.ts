import {
  Controller,
  Get,
  UseGuards,
  UnauthorizedException,
  Patch,
  Body,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { UsersService } from './users.service';
import type { UserPayload } from 'src/auth/interfaces';
import { EditUserProfileDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: UserPayload) {
    if (!user || !user.sub) {
      throw new UnauthorizedException('Usuario no válido');
    }
    const userData = await this.usersService.getMe(user.sub);
    return {
      user: userData,
    };
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async editMe(@GetUser() user: UserPayload, @Body() dto: EditUserProfileDto) {
    if (!user || !user.sub) {
      throw new UnauthorizedException('Usuario no válido');
    }
    const userData = await this.usersService.editMe(user.sub, dto);
    return {
      user: userData,
    };
  }
}
