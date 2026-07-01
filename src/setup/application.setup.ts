import { INestApplication } from '@nestjs/common';
import { AppConfig, getAppConfig } from '@/setup/config/get-app-config';
import { setupFilters } from '@/setup/filters/setup';
import { setupInterceptors } from '@/setup/interceptors/setup';
import { setupMiddleware } from '@/setup/middleware/setup';
import { setupPipes } from '@/setup/pipes/setup';

export function setupApplication(app: INestApplication): AppConfig {
  const config = getAppConfig(app);

  setupMiddleware(app, config);
  setupPipes(app);
  setupInterceptors(app);
  setupFilters(app);

  return config;
}
