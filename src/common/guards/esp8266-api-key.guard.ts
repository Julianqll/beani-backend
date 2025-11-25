import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class Esp8266ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredKey = this.configService.get<string>('API_KEY_ESP8266');

    if (!requiredKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('x-api-key');

    if (apiKey !== requiredKey) {
      throw new UnauthorizedException('Invalid device API key');
    }

    return true;
  }
}

