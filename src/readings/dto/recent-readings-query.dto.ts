import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class RecentReadingsQueryDto {
  @ApiPropertyOptional({
    description: 'Cantidad máxima de lecturas a devolver',
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(500)
  limit?: number = 50;

  @ApiPropertyOptional({
    description: 'Filtrar por dispositivo',
  })
  @IsOptional()
  @IsString()
  deviceId?: string;
}

