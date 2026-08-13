import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppConfigService } from '@/modules/config/app/app-config.service';


export function setupApplication(app: INestApplication): void {
  const { corsOrigins } = app.get(AppConfigService).config;

  app.use(helmet());
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  (app as NestExpressApplication).useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/api/uploads/',
  });
}