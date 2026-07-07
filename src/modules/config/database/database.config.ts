import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from '@/modules/config/database/database-config.types';

export function createDatabaseConfigFromEnv(): DatabaseConfig {
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'portfolio',
  };
}

export default registerAs('database', createDatabaseConfigFromEnv);