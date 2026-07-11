import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '@/modules/config/database/database-register.config';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get config(): DatabaseConfig {
    return {
      host: this.configService.get<string>('database.host', '127.0.0.1'),
      port: this.configService.get<number>('database.port', 3306),
      username: this.configService.get<string>('database.username', 'root'),
      password: this.configService.get<string>('database.password', ''),
      database: this.configService.get<string>('database.database', 'portfolio'),
    };
  }
}