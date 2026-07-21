import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  cleanExampleMeaning,
  cleanExampleSentence,
} from '../vocabularies/example-utils';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const topics = await this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { vocabularies: true },
        },
      },
    });

    return topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      imageUrl: topic.imageUrl,
      orderIndex: topic.orderIndex,
      totalWords: topic._count.vocabularies,
    }));
  }

  async findBySlug(slug: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { slug },
      include: {
        vocabularies: {
          orderBy: { orderNumber: 'asc' },
        },
        _count: {
          select: { vocabularies: true },
        },
      },
    });

    if (!topic) return null;

    return {
      ...topic,
      vocabularies: topic.vocabularies.map((vocabulary) => ({
        ...vocabulary,
        exampleSentence: cleanExampleSentence(vocabulary.exampleSentence),
        exampleMeaning: cleanExampleMeaning(vocabulary.exampleMeaning),
      })),
    };
  }

  async findBySlugWithProgress(slug: string, userId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { slug },
      include: {
        vocabularies: {
          orderBy: { orderNumber: 'asc' },
          include: {
            progresses: {
              where: { userId },
              select: { isLearned: true },
            },
            favorites: {
              where: { userId },
              select: { id: true },
            },
          },
        },
        _count: {
          select: { vocabularies: true },
        },
      },
    });

    if (!topic) return null;

    const vocabularies = topic.vocabularies.map((vocab) => ({
      id: vocab.id,
      word: vocab.word,
      partOfSpeech: vocab.partOfSpeech,
      ipa: vocab.ipa,
      meaningVi: vocab.meaningVi,
      imageUrl: vocab.imageUrl,
      audioUrl: vocab.audioUrl,
      exampleSentence: cleanExampleSentence(vocab.exampleSentence),
      exampleMeaning: cleanExampleMeaning(vocab.exampleMeaning),
      exampleTense: vocab.exampleTense,
      orderNumber: vocab.orderNumber,
      isLearned: vocab.progresses.length > 0 ? vocab.progresses[0].isLearned : false,
      isFavorite: vocab.favorites.length > 0,
    }));

    return {
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      imageUrl: topic.imageUrl,
      totalWords: topic._count.vocabularies,
      learnedWords: vocabularies.filter((v) => v.isLearned).length,
      vocabularies,
    };
  }

  async getTopicsWithProgress(userId: string) {
    const topics = await this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { vocabularies: true },
        },
        vocabularies: {
          select: {
            progresses: {
              where: { userId, isLearned: true },
              select: { id: true },
            },
          },
        },
      },
    });

    return topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      imageUrl: topic.imageUrl,
      orderIndex: topic.orderIndex,
      totalWords: topic._count.vocabularies,
      learnedWords: topic.vocabularies.filter((v) => v.progresses.length > 0).length,
    }));
  }
}
