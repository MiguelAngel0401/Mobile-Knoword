import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommunityDto, UpdateCommunityDto } from './dto';
import { TagsService } from './tags.service';
export declare class CommunitiesService {
    private readonly prisma;
    private readonly tagsService;
    constructor(prisma: PrismaService, tagsService: TagsService);
    createCommunity(communityDto: CreateCommunityDto, userId: number): Promise<Record<string, number>>;
    getExploreCommunities(): Promise<{
        createdAt: Date;
        communities: {
            createdAt: Date;
            id: number;
            name: string;
            banner: string | null;
        }[];
        id: number;
        name: string;
    }[]>;
    getCommunityById(id: number, userId: number): Promise<{
        memberCount: number;
        isOwner: boolean;
        isMember: boolean;
        tags: {
            createdAt: Date;
            id: number;
            name: string;
        }[];
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        name: string;
        description: string;
        banner: string | null;
        isPrivate: boolean;
        createdById: number;
    }>;
    getCommunitiesByTag(tag: string): Promise<{
        memberCount: number;
        avatar: string | null;
        createdAt: Date;
        id: number;
        _count: {
            members: number;
        };
        name: string;
        description: string;
        banner: string | null;
        isPrivate: boolean;
        tags: {
            id: number;
            name: string;
        }[];
    }[]>;
    getMyCommunities(userId: number): Promise<{
        memberCount: number;
        avatar: string | null;
        createdAt: Date;
        id: number;
        name: string;
        description: string;
        banner: string | null;
        isPrivate: boolean;
        tags: {
            id: number;
            name: string;
        }[];
    }[]>;
    joinCommunity(communityId: number, userId: number): Promise<{
        message: string;
    }>;
    getUserCommunities(userId: number): Promise<{
        memberCount: number;
        avatar: string | null;
        createdAt: Date;
        id: number;
        name: string;
        description: string;
        banner: string | null;
        isPrivate: boolean;
        tags: {
            id: number;
            name: string;
        }[];
    }[]>;
    updateCommunity(communityId: number, dto: UpdateCommunityDto, userId: number): Promise<{
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        name: string;
        description: string;
        banner: string | null;
        isPrivate: boolean;
        createdById: number;
    }>;
    deleteCommunity(communityId: number): Promise<{
        message: string;
        communityId: number;
    }>;
    leaveCommunity(communityId: number, userId: number): Promise<{
        message: string;
    }>;
}
