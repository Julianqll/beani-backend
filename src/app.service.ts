import { Injectable } from '@nestjs/common';
import { version } from '../package.json';

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: 'Beani IoT Backend',
      version,
      timestamp: new Date().toISOString(),
    };
  }
}
