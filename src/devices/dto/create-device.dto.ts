import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Nombre legible del dispositivo o campo',
    example: 'Campo Soja 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;
}

