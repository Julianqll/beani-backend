import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class DailyReportQueryDto {
  @ApiProperty({
    description: 'Fecha en formato YYYY-MM-DD',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar por dispositivo',
  })
  @IsOptional()
  @IsString()
  deviceId?: string;
}

