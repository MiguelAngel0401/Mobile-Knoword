import { UsersService } from './users.service';
import type { UserPayload } from 'src/auth/interfaces';
import { EditUserProfileDto } from './dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(user: UserPayload): Promise<{
        user: {
            username: string;
            email: string;
            realName: string;
            avatar: string | null;
            bio: string | null;
            id: number;
        };
    }>;
    editMe(user: UserPayload, dto: EditUserProfileDto): Promise<{
        user: {
            username: string;
            email: string;
            realName: string;
            avatar: string | null;
            bio: string | null;
            id: number;
        };
    }>;
}
