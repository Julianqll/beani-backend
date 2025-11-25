import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Device } from '@prisma/client';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DevicesService } from './devices.service';

@ApiTags('devices')
@Controller('api/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(@Body() dto: CreateDeviceDto): Promise<Device> {
    return this.devicesService.create(dto);
  }

  @Get()
  findAll(): Promise<Device[]> {
    return this.devicesService.findAll();
  }
}

