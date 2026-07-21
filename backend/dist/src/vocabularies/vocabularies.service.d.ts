import { PrismaService } from '../prisma/prisma.service';
export declare class VocabulariesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    markLearned(userId: string, vocabularyId: string): Promise<{
        vocabularyId: string;
        isLearned: boolean;
    }>;
    toggleFavorite(userId: string, vocabularyId: string): Promise<{
        vocabularyId: string;
        isFavorite: boolean;
    }>;
    getFavorites(userId: string): Promise<{
        id: string;
        word: string;
        partOfSpeech: string;
        ipa: string;
        meaningVi: string;
        exampleSentence: string;
        exampleMeaning: string;
        orderNumber: number;
        isFavorite: boolean;
        isLearned: boolean;
        topic: {
            title: string;
            slug: string;
        };
        favoritedAt: Date;
    }[]>;
    getLearned(userId: string): Promise<{
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
        topic: {
            title: string;
            slug: string;
        };
        learnedAt: Date | null;
    }[]>;
    private ensureVocabulary;
}
