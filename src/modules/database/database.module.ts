import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DatabaseConfigService } from '@/modules/config/database/database-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfigService],
      useFactory: (databaseConfigService: DatabaseConfigService) => {
        const db = databaseConfigService.config;

        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          charset: 'utf8mb4',
          autoLoadEntities: true,
          synchronize: false,
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid TypeORM options');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
})
export class DatabaseModule {}
