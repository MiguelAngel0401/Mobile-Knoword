import { Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class TagsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOrCreateTags(tags: string[]): Promise<Tag[]>;
    findRecommendations(tag: string): Promise<Tag[]>;
}
