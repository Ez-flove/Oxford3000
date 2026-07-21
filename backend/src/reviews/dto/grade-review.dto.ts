import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GradeReviewDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  quality: number;
}
