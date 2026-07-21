import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: {
        id: string;
    }): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getDashboard(user: {
        id: string;
    }): Promise<{
        learnedWords: number;
        favoriteWords: number;
        dueReviews: number;
        recentAttempts: {
            id: string;
            topic: {
                title: string;
                slug: string;
            };
            score: number;
            totalQuestions: number;
            correctAnswers: number;
            wrongAnswers: number;
            duration: number;
            completedAt: Date;
        }[];
    }>;
}
