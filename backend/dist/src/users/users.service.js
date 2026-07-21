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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
            },
        });
    }
    async getDashboard(userId) {
        const [learnedWords, favoriteWords, dueReviews, attempts] = await Promise.all([
            this.prisma.userProgress.count({ where: { userId, isLearned: true } }),
            this.prisma.userFavorite.count({ where: { userId } }),
            this.prisma.reviewSchedule.count({ where: { userId, dueDate: { lte: new Date() } } }),
            this.prisma.quizAttempt.findMany({
                where: { userId },
                orderBy: { completedAt: 'desc' },
                take: 5,
                include: { topic: { select: { title: true, slug: true } } },
            }),
        ]);
        return {
            learnedWords,
            favoriteWords,
            dueReviews,
            recentAttempts: attempts.map((attempt) => ({
                id: attempt.id,
                topic: attempt.topic,
                score: attempt.score,
                totalQuestions: attempt.totalQuestions,
                correctAnswers: attempt.correctAnswers,
                wrongAnswers: attempt.wrongAnswers,
                duration: attempt.duration,
                completedAt: attempt.completedAt,
            })),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map