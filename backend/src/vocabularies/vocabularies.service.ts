import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { cleanExampleMeaning, cleanExampleSentence } from './example-utils';

@Injectable()
export class VocabulariesService {
  constructor(private readonly prisma: PrismaService) {}

  async markLearned(userId: string, vocabularyId: string) {
    await this.ensureVocabulary(vocabularyId);

    const progress = await this.prisma.userProgress.upsert({
      where: { userId_vocabularyId: { userId, vocabularyId } },
      update: { isLearned: true, learnedAt: new Date() },
      create: { userId, vocabularyId, isLearned: true, learnedAt: new Date() },
    });

    await this.prisma.reviewSchedule.upsert({
      where: { userId_vocabularyId: { userId, vocabularyId } },
      update: {},
      create: { userId, vocabularyId },
    });

    return { vocabularyId: progress.vocabularyId, isLearned: progress.isLearned };
  }

  async toggleFavorite(userId: string, vocabularyId: string) {
    await this.ensureVocabulary(vocabularyId);

    const existing = await this.prisma.userFavorite.findUnique({
      where: { userId_vocabularyId: { userId, vocabularyId } },
    });

    if (existing) {
      await this.prisma.userFavorite.delete({ where: { id: existing.id } });
      return { vocabularyId, isFavorite: false };
    }

    await this.prisma.userFavorite.create({ data: { userId, vocabularyId } });
    return { vocabularyId, isFavorite: true };
  }

  async getFavorites(userId: string) {
    const favorites = await this.prisma.userFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        vocabulary: {
          include: {
            topic: { select: { title: true, slug: true } },
            progresses: {
              where: { userId },
              select: { isLearned: true },
            },
          },
        },
      },
    });

    return favorites.map((favorite) => ({
      id: favorite.vocabulary.id,
      word: favorite.vocabulary.word,
      partOfSpeech: favorite.vocabulary.partOfSpeech,
      ipa: favorite.vocabulary.ipa,
      meaningVi: favorite.vocabulary.meaningVi,
      exampleSentence: cleanExampleSentence(favorite.vocabulary.exampleSentence),
      exampleMeaning: cleanExampleMeaning(favorite.vocabulary.exampleMeaning),
      orderNumber: favorite.vocabulary.orderNumber,
      isFavorite: true,
      isLearned:
        favorite.vocabulary.progresses.length > 0
          ? favorite.vocabulary.progresses[0].isLearned
          : false,
      topic: favorite.vocabulary.topic,
      favoritedAt: favorite.createdAt,
    }));
  }

  async getLearned(userId: string) {
    const learned = await this.prisma.userProgress.findMany({
      where: { userId, isLearned: true },
      orderBy: { learnedAt: 'desc' },
      include: {
        vocabulary: {
          include: {
            topic: { select: { title: true, slug: true } },
            favorites: {
              where: { userId },
              select: { id: true },
            },
          },
        },
      },
    });

    return learned.map((progress) => ({
      id: progress.vocabulary.id,
      word: progress.vocabulary.word,
      partOfSpeech: progress.vocabulary.partOfSpeech,
      ipa: progress.vocabulary.ipa,
      meaningVi: progress.vocabulary.meaningVi,
      imageUrl: progress.vocabulary.imageUrl,
      audioUrl: progress.vocabulary.audioUrl,
      exampleSentence: cleanExampleSentence(progress.vocabulary.exampleSentence),
      exampleMeaning: cleanExampleMeaning(progress.vocabulary.exampleMeaning),
      exampleTense: progress.vocabulary.exampleTense,
      orderNumber: progress.vocabulary.orderNumber,
      isLearned: true,
      isFavorite: progress.vocabulary.favorites.length > 0,
      topic: progress.vocabulary.topic,
      learnedAt: progress.learnedAt,
    }));
  }

  private async ensureVocabulary(vocabularyId: string) {
    const vocabulary = await this.prisma.vocabulary.findUnique({ where: { id: vocabularyId } });
    if (!vocabulary) {
      throw new NotFoundException('Không tìm thấy từ vựng');
    }
    return vocabulary;
  }
}
