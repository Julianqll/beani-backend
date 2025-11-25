import { BadRequestException, Injectable } from '@nestjs/common';
import { Reading } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReadingDto } from './dto/create-reading.dto';
import { DailyHistoryQueryDto } from './dto/daily-history-query.dto';
import { RangeQueryDto } from './dto/range-query.dto';
import { RecentReadingsQueryDto } from './dto/recent-readings-query.dto';

@Injectable()
export class ReadingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateReadingDto): Promise<Reading> {
    const device = await this.prisma.device.findUnique({
      where: { id: payload.deviceId },
    });

    if (!device) {
      await this.prisma.device.create({
        data: {
          id: payload.deviceId,
          name: `Device ${payload.deviceId}`,
        },
      });
    }

    const recordedAt = payload.timestamp ? new Date(payload.timestamp) : null;

    return this.prisma.reading.create({
      data: {
        deviceId: payload.deviceId,
        temperature: payload.temperatura,
        airHumidity: payload.humedadAire,
        soilMoisture: payload.humedadSuelo,
        lux: Math.round(payload.lux),
        createdAt: recordedAt ?? undefined,
      },
    });
  }

  findRecent(query: RecentReadingsQueryDto): Promise<Reading[]> {
    const limit = query.limit ?? 50;
    const where = query.deviceId
      ? {
          deviceId: query.deviceId,
        }
      : undefined;

    return this.prisma.reading.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findDailyHistory(query: DailyHistoryQueryDto): Promise<Reading[]> {
    const { start, end } = this.resolveDateRangeFromDay(query.fecha);
    const where = {
      createdAt: { gte: start, lte: end },
      ...(query.deviceId ? { deviceId: query.deviceId } : {}),
    };

    return this.prisma.reading.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findRange(query: RangeQueryDto): Promise<Reading[]> {
    const start = new Date(query.desde);
    const end = new Date(query.hasta);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date range');
    }

    if (start > end) {
      throw new BadRequestException('desde debe ser menor o igual a hasta');
    }

    const where = {
      createdAt: { gte: start, lte: end },
      ...(query.deviceId ? { deviceId: query.deviceId } : {}),
    };

    return this.prisma.reading.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  private resolveDateRangeFromDay(fecha: string) {
    const start = new Date(`${fecha}T00:00:00.000Z`);
    const end = new Date(`${fecha}T23:59:59.999Z`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }

    return { start, end };
  }
}
