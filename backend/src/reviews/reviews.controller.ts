import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GradeReviewDto } from './dto/grade-review.dto';
import { ReviewsService } from './reviews.service';

@UseGuards(JwtGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('due')
  getDue(@GetUser() user: { id: string }) {
    return this.reviewsService.getDue(user.id);
  }

  @Post(':id/grade')
  grade(
    @Param('id') scheduleId: string,
    @Body() gradeReviewDto: GradeReviewDto,
    @GetUser() user: { id: string },
  ) {
    return this.reviewsService.grade(user.id, scheduleId, gradeReviewDto.quality);
  }
}
