import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { AppModule } from '@/app.module';
import { AppConfigService } from '@/modules/config/app/app-config.service';
import { setupApplication } from '@/setup/application.setup';

async function bootstrap() {
  initializeTransactionalContext({
    storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
  });

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  setupApplication(app);

  await app.listen(app.get(AppConfigService).config.port);
}

bootstrap();
