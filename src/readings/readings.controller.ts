import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Reading } from '@prisma/client';
import { Esp8266ApiKeyGuard } from '../common/guards/esp8266-api-key.guard';
import { CreateReadingDto } from './dto/create-reading.dto';
import { DailyHistoryQueryDto } from './dto/daily-history-query.dto';
import { RangeQueryDto } from './dto/range-query.dto';
import { RecentReadingsQueryDto } from './dto/recent-readings-query.dto';
import { ReadingsService } from './readings.service';

@ApiTags('lecturas')
@Controller('api/lecturas')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post()
  @UseGuards(Esp8266ApiKeyGuard)
  create(@Body() dto: CreateReadingDto): Promise<Reading> {
    return this.readingsService.create(dto);
  }

  @Get('recientes')
  findRecent(@Query() query: RecentReadingsQueryDto): Promise<Reading[]> {
    return this.readingsService.findRecent(query);
  }

  @Get('historico')
  findDailyHistory(@Query() query: DailyHistoryQueryDto): Promise<Reading[]> {
    return this.readingsService.findDailyHistory(query);
  }

  @Get('rango')
  findRange(@Query() query: RangeQueryDto): Promise<Reading[]> {
    return this.readingsService.findRange(query);
  }
}

