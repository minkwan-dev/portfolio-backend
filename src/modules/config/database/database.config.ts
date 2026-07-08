import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from '@/modules/config/database/database-config.types';

export function createDatabaseConfigFromEnv(): DatabaseConfig {
  return {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
  };
}

export default registerAs('database', createDatabaseConfigFromEnv);