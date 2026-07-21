import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { VocabulariesService } from './vocabularies.service';

@UseGuards(JwtGuard)
@Controller('vocabularies')
export class VocabulariesController {
  constructor(private readonly vocabulariesService: VocabulariesService) {}

  @Get('favorites')
  getFavorites(@GetUser() user: { id: string }) {
    return this.vocabulariesService.getFavorites(user.id);
  }

  @Get('learned')
  getLearned(@GetUser() user: { id: string }) {
    return this.vocabulariesService.getLearned(user.id);
  }

  @Post(':id/learn')
  markLearned(@Param('id') vocabularyId: string, @GetUser() user: { id: string }) {
    return this.vocabulariesService.markLearned(user.id, vocabularyId);
  }

  @Post(':id/favorite')
  toggleFavorite(@Param('id') vocabularyId: string, @GetUser() user: { id: string }) {
    return this.vocabulariesService.toggleFavorite(user.id, vocabularyId);
  }
}
