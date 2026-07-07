import { registerAs } from '@nestjs/config';
import { AppConfig } from '@/modules/config/app/app-config.types';

export function createAppConfigFromEnv(): AppConfig {
  return {
    port: parseInt(process.env.PORT ?? '3000', 10),
    corsOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [],
  };
}

export default registerAs('app', createAppConfigFromEnv);