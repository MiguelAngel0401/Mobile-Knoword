import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserProfileDto } from './dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: number): Promise<{
        username: string;
        email: string;
        realName: string;
        avatar: string | null;
        bio: string | null;
        id: number;
    }>;
    editMe(userId: number, dto: EditUserProfileDto): Promise<{
        username: string;
        email: string;
        realName: string;
        avatar: string | null;
        bio: string | null;
        id: number;
    }>;
}
