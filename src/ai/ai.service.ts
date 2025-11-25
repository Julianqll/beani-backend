import { Injectable } from '@nestjs/common';
import { Reading } from '@prisma/client';
import { ReadingsService } from '../readings/readings.service';
import { DailyReportQueryDto } from './dto/daily-report-query.dto';
import { IaReadingsQueryDto } from './dto/ia-readings-query.dto';

@Injectable()
export class AiService {
  constructor(private readonly readingsService: ReadingsService) {}

  async getReadingsForIa(query: IaReadingsQueryDto) {
    const readings = await this.readingsService.findRange({
      ...query,
    });

    return readings.map((reading) => ({
      deviceId: reading.deviceId,
      recordedAt: reading.createdAt,
      metrics: {
        temperature: reading.temperature,
        airHumidity: reading.airHumidity,
        soilMoisture: reading.soilMoisture,
        lux: reading.lux,
      },
    }));
  }

  async generateDailyReport(query: DailyReportQueryDto) {
    const readings = await this.readingsService.findDailyHistory({
      ...query,
    });

    if (!readings.length) {
      return {
        fecha: query.fecha,
        deviceId: query.deviceId ?? 'todos',
        resumen: 'No hay datos para la fecha solicitada.',
      };
    }

    const summary = this.buildSummary(readings);

    return {
      fecha: query.fecha,
      deviceId: query.deviceId ?? 'todos',
      resumen: `Temperatura promedio ${summary.temperature.avg.toFixed(
        2,
      )} °C; Humedad aire promedio ${summary.airHumidity.avg.toFixed(
        2,
      )} %; Humedad suelo promedio ${summary.soilMoisture.avg.toFixed(
        2,
      )}; Lux promedio ${summary.lux.avg.toFixed(2)}.`,
      metrics: summary,
    };
  }

  private buildSummary(readings: Reading[]) {
    const base = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
      sum: 0,
    };

    const aggregates = {
      temperature: { ...base },
      airHumidity: { ...base },
      soilMoisture: { ...base },
      lux: { ...base },
    };

    readings.forEach((reading) => {
      this.updateAggregate(aggregates.temperature, reading.temperature);
      this.updateAggregate(aggregates.airHumidity, reading.airHumidity);
      this.updateAggregate(aggregates.soilMoisture, reading.soilMoisture);
      this.updateAggregate(aggregates.lux, reading.lux);
    });

    const total = readings.length;

    return {
      temperature: this.toSummary(aggregates.temperature, total),
      airHumidity: this.toSummary(aggregates.airHumidity, total),
      soilMoisture: this.toSummary(aggregates.soilMoisture, total),
      lux: this.toSummary(aggregates.lux, total),
    };
  }

  private updateAggregate(
    aggregate: { min: number; max: number; sum: number },
    value: number,
  ) {
    aggregate.min = Math.min(aggregate.min, value);
    aggregate.max = Math.max(aggregate.max, value);
    aggregate.sum += value;
  }

  private toSummary(
    aggregate: { min: number; max: number; sum: number },
    total: number,
  ) {
    return {
      min: aggregate.min,
      max: aggregate.max,
      avg: aggregate.sum / total,
    };
  }
}

