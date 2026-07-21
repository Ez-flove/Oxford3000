import { GradeReviewDto } from './dto/grade-review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getDue(user: {
        id: string;
    }): Promise<{
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
    grade(scheduleId: string, gradeReviewDto: GradeReviewDto, user: {
        id: string;
    }): Promise<{
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
