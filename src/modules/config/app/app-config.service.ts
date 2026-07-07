import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/modules/config/app/app-config.types';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get config(): AppConfig {
    return {
      port: this.configService.get<number>('app.port', 3000),
      corsOrigins: this.configService.get<string[]>('app.corsOrigins', []),
    };
  }
}