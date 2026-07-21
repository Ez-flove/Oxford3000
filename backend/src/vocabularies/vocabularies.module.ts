import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';

@Module({
  imports: [AuthModule],
  controllers: [VocabulariesController],
  providers: [VocabulariesService],
  exports: [VocabulariesService],
})
export class VocabulariesModule {}
