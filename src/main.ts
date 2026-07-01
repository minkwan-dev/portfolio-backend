import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { setupApplication } from '@/setup/application.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port } = setupApplication(app);
  await app.listen(port);
}

bootstrap();