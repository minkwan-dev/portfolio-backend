import { ConfigService } from '@nestjs/config';

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export function getDatabaseConfig(
  configService: ConfigService,
): DatabaseConfig {
  return {
    host: configService.get<string>('database.host', '127.0.0.1'),
    port: configService.get<number>('database.port', 3306),
    username: configService.get<string>('database.username', 'root'),
    password: configService.get<string>('database.password', ''),
    database: configService.get<string>('database.database', 'portfolio'),
  };
}