import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommunityDto, UpdateCommunityDto } from './dto';
import { TagsService } from './tags.service';

@Injectable()
export class CommunitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
  ) {}

  async createCommunity(
    communityDto: CreateCommunityDto,
    userId: number,
  ): Promise<Record<string, number>> {
    const { tags: tagNames, ...communityData } = communityDto;

    // Paso 1: Usar el servicio de tags para obtener o crear las etiquetas
    const tags = await this.tagsService.findOrCreateTags(tagNames);

    // Paso 2: Crear la comunidad, conectando las etiquetas y añadiendo al creador como miembro ADMIN
    const communityId = await this.prisma.community.create({
      data: {
        ...communityData,
        createdById: userId, // El campo en el schema es `createdById`
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
        members: {
          create: {
            userId: userId,
            role: 'ADMIN',
          },
        },
      },
      select: {
        id: true,
      },
    });

    return communityId;
  }

  async getExploreCommunities() {
    const tagsWithCommunities = await this.prisma.tag.findMany({
      where: {
        communities: {
          some: {
            deletedAt: null, // Solo comunidades activas
            isPrivate: false, // Solo comunidades públicas
          },
        },
      },
      // Seleccionamos solo los campos necesarios de Tag
      select: {
        id: true,
        name: true,
        createdAt: true,
        // Incluimos las comunidades relacionadas
        communities: {
          take: 5, // Limitamos a 5 comunidades por etiqueta
          where: {
            deletedAt: null,
            isPrivate: false,
          },
          // Selecionamos los campos necesarios de Community
          select: {
            id: true,
            name: true,
            banner: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      take: 10, //Limitar a 10 tags
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tagsWithCommunities;
  }

  async getCommunityById(id: number, userId: number) {
    const community = await this.prisma.community.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        tags: true,
        _count: {
          select: {
            members: true,
          },
        },
        members: {
          where: {
            userId,
          },
        },
        createdBy: true,
      },
    });

    if (!community) {
      throw new NotFoundException('No se encontró la comunidad');
    }

    const { _count, members, createdBy, ...communityData } = community;

    // Verifica si el usuario es propietario de la comunidad
    const isOwner = createdBy.id === userId;

    // Verifica si el usuario es miembro de la comunidad
    const isMember = members.length > 0;
    return { ...communityData, memberCount: _count.members, isOwner, isMember };
  }

  async getCommunitiesByTag(tag: string) {
    // 1. Verificar si la etiqueta existe
    const existingTag = await this.prisma.tag.findUnique({
      where: { name: tag },
    });

    if (!existingTag) {
      throw new NotFoundException(`La etiqueta "${tag}" no existe.`);
    }

    // 2. Buscar comunidades asociadas a la etiqueta
    const communities = await this.prisma.community.findMany({
      where: {
        tags: {
          some: {
            name: tag,
          },
        },
        deletedAt: null, // Excluir comunidades eliminadas
      },
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        banner: true,
        isPrivate: true,
        createdAt: true,
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // 3. Verificar si se encontraron comunidades
    if (communities.length === 0) {
      throw new NotFoundException(
        `No existen comunidades asociadas a la etiqueta "${tag}".`,
      );
    }

    return communities.map((community) => ({
      ...community,
      memberCount: community._count.members,
    }));
  }

  async getMyCommunities(userId: number) {
    const communities = await this.prisma.community.findMany({
      where: {
        createdById: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        banner: true,
        isPrivate: true,
        createdAt: true,
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return communities.map(({ _count, ...communityData }) => ({
      ...communityData,
      memberCount: _count.members,
    }));
  }

  async joinCommunity(communityId: number, userId: number) {
    // 1. Verificar que la comunidad exista y no esté eliminada, y si el usuario ya es miembro
    const community = await this.prisma.community.findUnique({
      where: {
        id: communityId,
        deletedAt: null,
      },
      select: {
        isPrivate: true,
        members: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    if (!community) {
      throw new NotFoundException(
        `La comunidad con ID ${communityId} no existe o fue eliminada.`,
      );
    }

    // 2. Verificar que el usuario no sea ya miembro
    if (community.members.length > 0) {
      throw new ForbiddenException('Ya eres miembro de esta comunidad.');
    }

    // 3. Verificar si la comunidad es privada
    if (community.isPrivate) {
      throw new ForbiddenException(
        'No puedes unirte a una comunidad privada directamente. Se requiere una invitación.',
      );
    }

    // 4. Crear la membresía con el rol de MIEMBRO
    await this.prisma.communityMember.create({
      data: {
        userId: userId,
        communityId: communityId,
        role: 'MEMBER',
      },
    });

    return { message: 'Te has unido a la comunidad exitosamente.' };
  }

  async getUserCommunities(userId: number) {
    const communities = await this.prisma.community.findMany({
      where: {
        // Filtrar comunidades donde el usuario es miembro, sin importar el rol
        members: {
          some: {
            userId: userId,
          },
        },
        // Excluir comunidades eliminadas
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        banner: true,
        isPrivate: true,
        createdAt: true,
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mapear el resultado para incluir memberCount, igual que en getMyCommunities
    return communities.map(({ _count, ...communityData }) => ({
      ...communityData,
      memberCount: _count.members,
    }));
  }

  async updateCommunity(
    communityId: number,
    dto: UpdateCommunityDto,
    userId: number,
  ) {
    // 1. Buscar la comunidad para asegurar que existe y que el usuario es el propietario.
    const community = await this.prisma.community.findUnique({
      where: { id: communityId, deletedAt: null },
      select: { createdById: true },
    });

    if (!community) {
      throw new NotFoundException(
        `La comunidad con ID ${communityId} no fue encontrada`,
      );
    }

    if (community.createdById !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para editar esta comunidad',
      );
    }

    const { tags: tagNames, ...communityData } = dto;

    // 2. Si se proporcionan etiquetas, buscarlas o crearlas.
    if (tagNames) {
      const tags = await this.tagsService.findOrCreateTags(tagNames);
      // 3. Actualizar la comunidad y sus etiquetas usando `set` para sincronizarlas.
      return this.prisma.community.update({
        where: { id: communityId },
        data: {
          ...communityData,
          tags: {
            set: tags.map((tag) => ({ id: tag.id })),
          },
        },
      });
    }

    // 4. Si no se proporcionan etiquetas, solo actualizar los datos de la comunidad.
    return this.prisma.community.update({
      where: { id: communityId },
      data: communityData,
    });
  }

  async deleteCommunity(communityId: number) {
    const deletedCommunity = await this.prisma.community.update({
      where: {
        id: communityId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (!deletedCommunity) {
      throw new NotFoundException('No se encontró la comunidad');
    }
    return {
      message: 'Comunidad eliminada exitosamente',
      communityId: deletedCommunity.id,
    };
  }

  async leaveCommunity(communityId: number, userId: number) {
    // 1. Verificar que la comunidad exista y no esté eliminada
    const community = await this.prisma.community.findUnique({
      where: {
        id: communityId,
        deletedAt: null,
      },
      select: {
        createdById: true,
        members: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    if (!community) {
      throw new NotFoundException(
        `La comunidad con ID ${communityId} no existe o fue eliminada.`,
      );
    }

    // 2. Verificar que el usuario sea miembro de la comunidad
    if (community.members.length === 0) {
      throw new ForbiddenException('No eres miembro de esta comunidad.');
    }

    // 3. Verificar que el usuario no sea el creador de la comunidad (no puede dejar su propia comunidad)
    if (community.createdById === userId) {
      throw new ForbiddenException(
        'No puedes dejar una comunidad que tú creaste. Debes eliminarla en su lugar.',
      );
    }

    // 4. Eliminar la membresía del usuario
    await this.prisma.communityMember.delete({
      where: {
        userId_communityId: {
          userId: userId,
          communityId: communityId,
        },
      },
    });

    return { message: 'Has salido de la comunidad exitosamente.' };
  }
}
