"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tags_service_1 = require("./tags.service");
let CommunitiesService = class CommunitiesService {
    prisma;
    tagsService;
    constructor(prisma, tagsService) {
        this.prisma = prisma;
        this.tagsService = tagsService;
    }
    async createCommunity(communityDto, userId) {
        const { tags: tagNames, ...communityData } = communityDto;
        const tags = await this.tagsService.findOrCreateTags(tagNames);
        const communityId = await this.prisma.community.create({
            data: {
                ...communityData,
                createdById: userId,
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
                        deletedAt: null,
                        isPrivate: false,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                communities: {
                    take: 5,
                    where: {
                        deletedAt: null,
                        isPrivate: false,
                    },
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
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
        return tagsWithCommunities;
    }
    async getCommunityById(id, userId) {
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
            throw new common_1.NotFoundException('No se encontró la comunidad');
        }
        const { _count, members, createdBy, ...communityData } = community;
        const isOwner = createdBy.id === userId;
        const isMember = members.length > 0;
        return { ...communityData, memberCount: _count.members, isOwner, isMember };
    }
    async getCommunitiesByTag(tag) {
        const existingTag = await this.prisma.tag.findUnique({
            where: { name: tag },
        });
        if (!existingTag) {
            throw new common_1.NotFoundException(`La etiqueta "${tag}" no existe.`);
        }
        const communities = await this.prisma.community.findMany({
            where: {
                tags: {
                    some: {
                        name: tag,
                    },
                },
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
        });
        if (communities.length === 0) {
            throw new common_1.NotFoundException(`No existen comunidades asociadas a la etiqueta "${tag}".`);
        }
        return communities.map((community) => ({
            ...community,
            memberCount: community._count.members,
        }));
    }
    async getMyCommunities(userId) {
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
    async joinCommunity(communityId, userId) {
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
            throw new common_1.NotFoundException(`La comunidad con ID ${communityId} no existe o fue eliminada.`);
        }
        if (community.members.length > 0) {
            throw new common_1.ForbiddenException('Ya eres miembro de esta comunidad.');
        }
        if (community.isPrivate) {
            throw new common_1.ForbiddenException('No puedes unirte a una comunidad privada directamente. Se requiere una invitación.');
        }
        await this.prisma.communityMember.create({
            data: {
                userId: userId,
                communityId: communityId,
                role: 'MEMBER',
            },
        });
        return { message: 'Te has unido a la comunidad exitosamente.' };
    }
    async getUserCommunities(userId) {
        const communities = await this.prisma.community.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
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
    async updateCommunity(communityId, dto, userId) {
        const community = await this.prisma.community.findUnique({
            where: { id: communityId, deletedAt: null },
            select: { createdById: true },
        });
        if (!community) {
            throw new common_1.NotFoundException(`La comunidad con ID ${communityId} no fue encontrada`);
        }
        if (community.createdById !== userId) {
            throw new common_1.ForbiddenException('No tienes permisos para editar esta comunidad');
        }
        const { tags: tagNames, ...communityData } = dto;
        if (tagNames) {
            const tags = await this.tagsService.findOrCreateTags(tagNames);
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
        return this.prisma.community.update({
            where: { id: communityId },
            data: communityData,
        });
    }
    async deleteCommunity(communityId) {
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
            throw new common_1.NotFoundException('No se encontró la comunidad');
        }
        return {
            message: 'Comunidad eliminada exitosamente',
            communityId: deletedCommunity.id,
        };
    }
    async leaveCommunity(communityId, userId) {
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
            throw new common_1.NotFoundException(`La comunidad con ID ${communityId} no existe o fue eliminada.`);
        }
        if (community.members.length === 0) {
            throw new common_1.ForbiddenException('No eres miembro de esta comunidad.');
        }
        if (community.createdById === userId) {
            throw new common_1.ForbiddenException('No puedes dejar una comunidad que tú creaste. Debes eliminarla en su lugar.');
        }
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
};
exports.CommunitiesService = CommunitiesService;
exports.CommunitiesService = CommunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tags_service_1.TagsService])
], CommunitiesService);
//# sourceMappingURL=communities.service.js.map