import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getProfile(userId: string) {
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

  async getDashboard(userId: string) {
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
}
