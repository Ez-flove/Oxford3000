import { PrismaService } from '../prisma/prisma.service';
type Sm2Input = {
    interval: number;
    easeFactor: number;
    repetitions: number;
    quality: number;
};
export declare function calculateSm2({ interval, easeFactor, repetitions, quality }: Sm2Input): {
    interval: number;
    easeFactor: number;
    repetitions: number;
};
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDue(userId: string): Promise<{
        id: string;
        dueDate: Date;
        interval: number;
        repetitions: number;
        vocabulary: {
            id: string;
            word: string;
            partOfSpeech: string;
            ipa: string;
            meaningVi: string;
            exampleSentence: string;
            exampleMeaning: string;
            topic: {
                title: string;
                slug: string;
            };
        };
    }[]>;
    grade(userId: string, scheduleId: string, quality: number): Promise<{
        id: string;
        userId: string;
        vocabularyId: string;
        interval: number;
        easeFactor: number;
        repetitions: number;
        dueDate: Date;
        lastReviewed: Date | null;
    }>;
}
export {};
