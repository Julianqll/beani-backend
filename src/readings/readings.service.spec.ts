/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReadingDto } from './dto/create-reading.dto';
import { ReadingsService } from './readings.service';

type PrismaMock = {
  device: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
  reading: {
    create: jest.Mock;
    findMany: jest.Mock;
  };
};

const prismaMock: PrismaMock = {
  device: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  reading: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ReadingsService', () => {
  let service: ReadingsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReadingsService,
        {
          provide: PrismaService,
          useValue: prismaMock as unknown as PrismaService,
        },
      ],
    }).compile();

    service = moduleRef.get(ReadingsService);
    jest.clearAllMocks();
  });

  it('creates a reading and auto-registers the device if needed', async () => {
    const dto: CreateReadingDto = {
      deviceId: 'device-1',
      temperatura: 24.5,
      humedadAire: 60,
      humedadSuelo: 420,
      lux: 300,
    };

    const readingResult = {
      id: 'reading-1',
      createdAt: new Date(),
      deviceId: dto.deviceId,
      temperature: dto.temperatura,
      airHumidity: dto.humedadAire,
      soilMoisture: dto.humedadSuelo,
      lux: dto.lux,
    };

    prismaMock.device.findUnique.mockResolvedValue(null);
    prismaMock.device.create.mockResolvedValue({ id: dto.deviceId, name: '' });
    prismaMock.reading.create.mockResolvedValue(readingResult);

    const result = await service.create(dto);

    expect(prismaMock.device.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: dto.deviceId }),
    });
    expect(prismaMock.reading.create).toHaveBeenCalled();
    expect(result).toEqual(readingResult);
  });

  it('retrieves readings for a specific day', async () => {
    const fecha = '2025-11-23';
    prismaMock.reading.findMany.mockResolvedValue([]);

    await service.findDailyHistory({ fecha, deviceId: 'device-1' });

    expect(prismaMock.reading.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        deviceId: 'device-1',
        createdAt: expect.objectContaining({
          gte: expect.any(Date),
          lte: expect.any(Date),
        }),
      }),
      orderBy: { createdAt: 'asc' },
    });
  });
});
