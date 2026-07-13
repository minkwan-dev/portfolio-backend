import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@/modules/config/app/app-register.config';
import databaseConfig from '@/modules/config/database/database-register.config';
import { AppConfigService } from '@/modules/config/app/app-config.service';
import { DatabaseConfigService } from '@/modules/config/database/database-config.service';
import { envValidationSchema } from '@/modules/config/env.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
      }
    }),
  ],
  providers: [AppConfigService, DatabaseConfigService],
  exports: [AppConfigService, DatabaseConfigService],
})

export class AppConfigModule {}