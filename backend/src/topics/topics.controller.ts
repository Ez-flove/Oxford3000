import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('progress')
  getTopicsWithProgress(@GetUser() user: { id: string }) {
    return this.topicsService.getTopicsWithProgress(user.id);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const topic = await this.topicsService.findBySlug(slug);
    if (!topic) {
      throw new NotFoundException('Không tìm thấy chủ đề');
    }
    return topic;
  }

  @UseGuards(JwtGuard)
  @Get(':slug/vocabularies')
  async findBySlugWithProgress(@Param('slug') slug: string, @GetUser() user: { id: string }) {
    const topic = await this.topicsService.findBySlugWithProgress(slug, user.id);
    if (!topic) {
      throw new NotFoundException('Không tìm thấy chủ đề');
    }
    return topic;
  }
}
