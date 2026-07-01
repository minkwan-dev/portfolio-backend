import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type AppConfig = {
  port: number;
  corsOrigins: string[];
};

export function getAppConfig(app: INestApplication): AppConfig {
  const configService = app.get(ConfigService);

  return {
    port: configService.get<number>('app.port', 3000),
    corsOrigins: configService.get<string[]>('app.cors.origins', []),
  };
}
