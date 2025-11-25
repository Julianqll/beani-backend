import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class RangeQueryDto {
  @ApiProperty({
    description: 'Fecha inicial en ISO 8601',
    example: '2025-11-23T00:00:00Z',
  })
  @IsDateString()
  desde: string;

  @ApiProperty({
    description: 'Fecha final en ISO 8601',
    example: '2025-11-24T00:00:00Z',
  })
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

