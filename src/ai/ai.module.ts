import { Module } from '@nestjs/common';
import { ReadingsModule } from '../readings/readings.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ReadingsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}

