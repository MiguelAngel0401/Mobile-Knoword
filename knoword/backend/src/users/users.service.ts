import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserProfileDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: number) {
    if (!userId || userId <= 0) {
      throw new NotFoundException('ID de usuario inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        realName: true,
        avatar: true,
        bio: true,
      },
    });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    return user;
  }

  async editMe(userId: number, dto: EditUserProfileDto) {
    if (!userId || userId <= 0) {
      throw new NotFoundException('ID de usuario inválido');
    }

    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: dto,
        select: {
          id: true,
          username: true,
          email: true,
          realName: true,
          avatar: true,
          bio: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('El usuario no existe');
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            'El correo o nombre de usuario ya existe.',
          );
        }
      }
      throw error;
    }
  }
}
