import { Module } from '@nestjs/common';
import { Esp8266ApiKeyGuard } from '../common/guards/esp8266-api-key.guard';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';

@Module({
  controllers: [ReadingsController],
  providers: [ReadingsService, Esp8266ApiKeyGuard],
  exports: [ReadingsService],
})
export class ReadingsModule {}

