import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';

class QuizAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsNotEmpty()
  answer: string | string[] | boolean;
}

export class SubmitQuizDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers: QuizAnswerDto[];
}
