import { registerAs } from '@nestjs/config';

export type AppConfig = {
  port: number;
  corsOrigins: string[];
};

export function createAppConfigFromEnv(): AppConfig {
  return {
    port: Number(process.env.PORT),
    corsOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [],
  };
}

export default registerAs('app', createAppConfigFromEnv);