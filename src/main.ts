import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupApplication } from './setup/application.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApplication(app);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('app.port', 3000));
}

bootstrap();