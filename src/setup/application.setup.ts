import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

export function setupApplication(app: INestApplication): void {
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(helmet());

  const allowedOrigins = configService.get<string[]>('app.cors.origins', []);
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter()
  );
}