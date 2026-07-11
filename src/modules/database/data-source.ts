import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { createDatabaseConfigFromEnv } from '@/modules/config/database/database-register.config';

config({ path: '.env' });

const db = createDatabaseConfigFromEnv();

export default new DataSource({
  type: 'mysql',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  charset: 'utf8mb4',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});