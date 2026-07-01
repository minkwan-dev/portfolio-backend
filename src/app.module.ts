import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import registerAppConfig from '@/setup/config/register-app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [registerAppConfig],
    }),
  ],
})

export class AppModule {}
