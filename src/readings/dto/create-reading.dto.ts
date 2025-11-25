import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReadingDto {
  @ApiProperty({
    description: 'Identificador del dispositivo que envía la lectura',
    example: 'device-1',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ example: 25.3 })
  @Type(() => Number)
  @IsNumber()
  temperatura: number;

  @ApiProperty({ example: 61.0 })
  @Type(() => Number)
  @IsNumber()
  humedadAire: number;

  @ApiProperty({ example: 430 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  humedadSuelo: number;

  @ApiProperty({ example: 312 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100000)
  lux: number;

  @ApiProperty({
    required: false,
    description:
      'Marca de tiempo opcional, si no se envía se usa la hora actual del servidor',
    example: '2025-11-23T18:45:00Z',
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}

