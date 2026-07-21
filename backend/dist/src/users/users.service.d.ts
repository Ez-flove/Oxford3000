import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getDashboard(userId: string): Promise<{
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
