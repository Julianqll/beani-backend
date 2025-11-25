import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class IaReadingsQueryDto {
  @ApiProperty({ description: 'Fecha inicial en ISO 8601' })
  @IsDateString()
  desde: string;

  @ApiProperty({ description: 'Fecha final en ISO 8601' })
  @IsDateString()
  hasta: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar por dispositivo',
  })
  @IsOptional()
  @IsString()
  deviceId?: string;
}

