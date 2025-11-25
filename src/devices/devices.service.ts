import { Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateDeviceDto): Promise<Device> {
    return this.prisma.device.create({
      data: {
        name: data.name,
      },
    });
  }

  findAll(): Promise<Device[]> {
    return this.prisma.device.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

