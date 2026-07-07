import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@/modules/config/app/app.config';
import databaseConfig from '@/modules/config/database/database.config';
import { AppConfigService } from '@/modules/config/app/app-config.service';
import { DatabaseConfigService } from '@/modules/config/database/database-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig],
    }),
  ],
  providers: [AppConfigService, DatabaseConfigService],
  exports: [AppConfigService, DatabaseConfigService],
})
export class AppConfigModule {}