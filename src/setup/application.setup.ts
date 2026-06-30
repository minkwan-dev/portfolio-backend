import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';

export function setupApplication(app: INestApplication): void {
  app.setGlobalPrefix('api');

  app.use(helmet());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
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
}