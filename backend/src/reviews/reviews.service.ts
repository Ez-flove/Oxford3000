import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Sm2Input = {
  interval: number;
  easeFactor: number;
  repetitions: number;
  quality: number;
};

export function calculateSm2({ interval, easeFactor, repetitions, quality }: Sm2Input) {
  let nextInterval = 1;
  let nextRepetitions = repetitions;

  if (quality < 3) {
    nextRepetitions = 0;
  } else {
    if (repetitions === 0) {
      nextInterval = 1;
    } else if (repetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(interval * easeFactor);
    }
    nextRepetitions += 1;
  }

  const difficulty = 5 - quality;
  const nextEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - difficulty * (0.08 + difficulty * 0.02)),
  );

  return {
    interval: nextInterval,
    easeFactor: Number(nextEaseFactor.toFixed(2)),
    repetitions: nextRepetitions,
  };
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDue(userId: string) {
    const schedules = await this.prisma.reviewSchedule.findMany({
      where: { userId, dueDate: { lte: new Date() } },
      orderBy: { dueDate: 'asc' },
      include: {
        vocabulary: {
          include: { topic: { select: { title: true, slug: true } } },
        },
      },
    });

    return schedules.map((schedule) => ({
      id: schedule.id,
      dueDate: schedule.dueDate,
      interval: schedule.interval,
      repetitions: schedule.repetitions,
      vocabulary: {
        id: schedule.vocabulary.id,
        word: schedule.vocabulary.word,
        partOfSpeech: schedule.vocabulary.partOfSpeech,
        ipa: schedule.vocabulary.ipa,
        meaningVi: schedule.vocabulary.meaningVi,
        exampleSentence: schedule.vocabulary.exampleSentence,
        exampleMeaning: schedule.vocabulary.exampleMeaning,
        topic: schedule.vocabulary.topic,
      },
    }));
  }

  async grade(userId: string, scheduleId: string, quality: number) {
    const schedule = await this.prisma.reviewSchedule.findFirst({
      where: { id: scheduleId, userId },
    });

    if (!schedule) {
      throw new NotFoundException('Không tìm thấy lịch ôn tập');
    }

    const next = calculateSm2({
      interval: schedule.interval,
      easeFactor: schedule.easeFactor,
      repetitions: schedule.repetitions,
      quality,
    });
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + next.interval);

    return this.prisma.reviewSchedule.update({
      where: { id: schedule.id },
      data: {
        interval: next.interval,
        easeFactor: next.easeFactor,
        repetitions: next.repetitions,
        dueDate,
        lastReviewed: new Date(),
      },
    });
  }
}
