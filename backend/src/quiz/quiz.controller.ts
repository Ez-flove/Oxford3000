import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizService } from './quiz.service';

@UseGuards(JwtGuard)
@Controller()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('topics/:id/quiz/generate')
  generate(@Param('id') topicId: string) {
    return this.quizService.generate(topicId);
  }

  @Post('quiz/submit')
  submit(@Body() submitQuizDto: SubmitQuizDto, @GetUser() user: { id: string }) {
    return this.quizService.submit(user.id, submitQuizDto);
  }
}
