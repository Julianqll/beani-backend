import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { DailyReportQueryDto } from './dto/daily-report-query.dto';
import { IaReadingsQueryDto } from './dto/ia-readings-query.dto';

@ApiTags('ia')
@Controller('api/ia')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('lecturas')
  getReadings(@Query() query: IaReadingsQueryDto) {
    return this.aiService.getReadingsForIa(query);
  }

  @Get('reporte-diario')
  getDailyReport(@Query() query: DailyReportQueryDto) {
    return this.aiService.generateDailyReport(query);
  }
}

