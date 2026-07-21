import { VocabulariesService } from './vocabularies.service';
export declare class VocabulariesController {
    private readonly vocabulariesService;
    constructor(vocabulariesService: VocabulariesService);
    getFavorites(user: {
        id: string;
    }): Promise<{
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
    getLearned(user: {
        id: string;
    }): Promise<{
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
    markLearned(vocabularyId: string, user: {
        id: string;
    }): Promise<{
        vocabularyId: string;
        isLearned: boolean;
    }>;
    toggleFavorite(vocabularyId: string, user: {
        id: string;
    }): Promise<{
        vocabularyId: string;
        isFavorite: boolean;
    }>;
}
