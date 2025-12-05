import { CommunitiesService } from './communities.service';
import type { UserPayload } from 'src/auth/interfaces';
import { CreateCommunityDto, TagRecommendationDto, UpdateCommunityDto } from './dto';
import { TagsService } from './tags.service';
export declare class CommunitiesController {
    private readonly communitiesService;
    private readonly tagsService;
    constructor(communitiesService: CommunitiesService, tagsService: TagsService);
    createCommunity(communityDto: CreateCommunityDto, user: UserPayload): Promise<Record<string, number>>;
    recommendTags(query: TagRecommendationDto): Promise<{
        createdAt: Date;
        id: number;
        name: string;
    }[]>;
    exploreCommunities(): Promise<{
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
    getCommunityById(id: number, user: UserPayload): Promise<{
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
    getMyCommunities(user: UserPayload): Promise<{
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
    joinCommunity(id: number, user: UserPayload): Promise<{
        message: string;
    }>;
    leaveCommunity(id: number, user: UserPayload): Promise<{
        message: string;
    }>;
    getUserCommunities(user: UserPayload): Promise<{
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
    updateCommunity(id: number, dto: UpdateCommunityDto, user: UserPayload): Promise<{
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
    deleteCommunity(id: number): Promise<{
        message: string;
        communityId: number;
    }>;
}
