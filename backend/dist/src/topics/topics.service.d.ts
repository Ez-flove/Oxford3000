import { PrismaService } from '../prisma/prisma.service';
export declare class TopicsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        orderIndex: number;
        totalWords: number;
    }[]>;
    findBySlug(slug: string): Promise<{
        vocabularies: {
            exampleSentence: string;
            exampleMeaning: string;
            id: string;
            imageUrl: string | null;
            createdAt: Date;
            word: string;
            partOfSpeech: string;
            ipa: string;
            meaningVi: string;
            audioUrl: string | null;
            exampleTense: string | null;
            orderNumber: number;
            topicId: string;
        }[];
        _count: {
            vocabularies: number;
        };
        id: string;
        title: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        orderIndex: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findBySlugWithProgress(slug: string, userId: string): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        totalWords: number;
        learnedWords: number;
        vocabularies: {
            id: string;
            word: string;
            partOfSpeech: string;
            ipa: string;
            meaningVi: string;
            imageUrl: string | null;
            audioUrl: string | null;
            exampleSentence: string;
            exampleMeaning: string;
            exampleTense: string | null;
            orderNumber: number;
            isLearned: boolean;
            isFavorite: boolean;
        }[];
    } | null>;
    getTopicsWithProgress(userId: string): Promise<{
        id: string;
        title: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        orderIndex: number;
        totalWords: number;
        learnedWords: number;
    }[]>;
}
