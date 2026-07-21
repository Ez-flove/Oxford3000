import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuizModule } from './quiz/quiz.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';
import { VocabulariesModule } from './vocabularies/vocabularies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TopicsModule,
    VocabulariesModule,
    ReviewsModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
