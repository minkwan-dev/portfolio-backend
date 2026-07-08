import { registerAs } from '@nestjs/config';
import { AppConfig } from '@/modules/config/app/app-config.types';

export function createAppConfigFromEnv(): AppConfig {
  return {
    port: Number(process.env.PORT),
    corsOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [],
  };
}

export default registerAs('app', createAppConfigFromEnv);