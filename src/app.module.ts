import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/modules/database/database.module';
import { UserModule } from '@/modules/user/user.module';
import registerAppConfig from '@/setup/config/register-app.config';
import registerDatabaseConfig from '@/setup/config/register-database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [registerAppConfig, registerDatabaseConfig],
    }),
    DatabaseModule,
    UserModule,
  ],
})

export class AppModule {}