import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { RefineTextDto } from './dto/refine-text.dto';
import { CoverLetterDto } from './dto/cover-letter.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('refine-text')
  async refineText(@Body() dto: RefineTextDto) {
    return this.aiService.refineText(dto);
  }

  @Post('generate-cover-letter')
  async generateCoverLetter(@Body() dto: CoverLetterDto) {
    return this.aiService.generateCoverLetter(dto);
  }
}
