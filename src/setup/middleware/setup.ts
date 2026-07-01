import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { AppConfig } from '@/setup/config/get-app-config';

export function setupMiddleware(
  app: INestApplication,
  config: AppConfig,
): void {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors({
    origin: config.corsOrigins.length > 0 ? config.corsOrigins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
}
