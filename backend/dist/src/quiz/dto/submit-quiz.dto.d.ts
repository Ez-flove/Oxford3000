declare class QuizAnswerDto {
    questionId: string;
    answer: string | string[] | boolean;
}
export declare class SubmitQuizDto {
    topicId: string;
    duration: number;
    answers: QuizAnswerDto[];
}
export {};
