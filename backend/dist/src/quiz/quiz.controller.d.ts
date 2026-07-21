import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizService } from './quiz.service';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    generate(topicId: string): Promise<{
        topic: {
            id: string;
            title: string;
            slug: string;
        };
        questions: ({
            prompt: string;
            correctAnswer: string;
            id: string;
            type: "EN_TO_VI_TEXT" | "VI_TO_EN_TEXT" | "MULTIPLE_CHOICE_4" | "PART_OF_SPEECH" | "FILL_IN_BLANK" | "CHOOSE_CORRECT_WORD" | "MATCH_WORD_MEANING" | "MATCH_WORD_IMAGE" | "WORD_REORDER" | "TRUE_FALSE_MEANING" | "IDENTIFY_TENSE" | "WRITE_NEW_SENTENCE";
            vocabularyId: string;
        } | {
            options: string[];
            id: string;
            type: "EN_TO_VI_TEXT" | "VI_TO_EN_TEXT" | "MULTIPLE_CHOICE_4" | "PART_OF_SPEECH" | "FILL_IN_BLANK" | "CHOOSE_CORRECT_WORD" | "MATCH_WORD_MEANING" | "MATCH_WORD_IMAGE" | "WORD_REORDER" | "TRUE_FALSE_MEANING" | "IDENTIFY_TENSE" | "WRITE_NEW_SENTENCE";
            vocabularyId: string;
            prompt: string;
            correctAnswer: string;
        } | {
            pairs: {
                word: string;
                meaningVi: string;
            }[];
            correctAnswer: string;
            id: string;
            type: "EN_TO_VI_TEXT" | "VI_TO_EN_TEXT" | "MULTIPLE_CHOICE_4" | "PART_OF_SPEECH" | "FILL_IN_BLANK" | "CHOOSE_CORRECT_WORD" | "MATCH_WORD_MEANING" | "MATCH_WORD_IMAGE" | "WORD_REORDER" | "TRUE_FALSE_MEANING" | "IDENTIFY_TENSE" | "WRITE_NEW_SENTENCE";
            vocabularyId: string;
            prompt: string;
        } | {
            options: {
                id: string;
                word: string;
                imageUrl: string | null;
            }[];
            correctAnswer: string;
            id: string;
            type: "EN_TO_VI_TEXT" | "VI_TO_EN_TEXT" | "MULTIPLE_CHOICE_4" | "PART_OF_SPEECH" | "FILL_IN_BLANK" | "CHOOSE_CORRECT_WORD" | "MATCH_WORD_MEANING" | "MATCH_WORD_IMAGE" | "WORD_REORDER" | "TRUE_FALSE_MEANING" | "IDENTIFY_TENSE" | "WRITE_NEW_SENTENCE";
            vocabularyId: string;
            prompt: string;
        } | {
            prompt: string;
            tiles: string[];
            correctAnswer: string;
            id: string;
            type: "EN_TO_VI_TEXT" | "VI_TO_EN_TEXT" | "MULTIPLE_CHOICE_4" | "PART_OF_SPEECH" | "FILL_IN_BLANK" | "CHOOSE_CORRECT_WORD" | "MATCH_WORD_MEANING" | "MATCH_WORD_IMAGE" | "WORD_REORDER" | "TRUE_FALSE_MEANING" | "IDENTIFY_TENSE" | "WRITE_NEW_SENTENCE";
            vocabularyId: string;
        } | {
            prompt: string;
            correctAnswer: boolean;
            id: string;
            type: "EN_TO_VI_TEXT" | "VI_TO_EN_TEXT" | "MULTIPLE_CHOICE_4" | "PART_OF_SPEECH" | "FILL_IN_BLANK" | "CHOOSE_CORRECT_WORD" | "MATCH_WORD_MEANING" | "MATCH_WORD_IMAGE" | "WORD_REORDER" | "TRUE_FALSE_MEANING" | "IDENTIFY_TENSE" | "WRITE_NEW_SENTENCE";
            vocabularyId: string;
        } | {
            prompt: string;
            sampleAnswer: string;
            correctAnswer: string;
            id: string;
            type: "EN_TO_VI_TEXT" | "VI_TO_EN_TEXT" | "MULTIPLE_CHOICE_4" | "PART_OF_SPEECH" | "FILL_IN_BLANK" | "CHOOSE_CORRECT_WORD" | "MATCH_WORD_MEANING" | "MATCH_WORD_IMAGE" | "WORD_REORDER" | "TRUE_FALSE_MEANING" | "IDENTIFY_TENSE" | "WRITE_NEW_SENTENCE";
            vocabularyId: string;
        })[];
    }>;
    submit(submitQuizDto: SubmitQuizDto, user: {
        id: string;
    }): Promise<{
        attemptId: string;
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        wrongAnswers: number;
        duration: number;
        graded: {
            questionId: string;
            vocabularyId: string;
            isCorrect: boolean;
            correctAnswer: string | boolean;
        }[];
    }>;
}
