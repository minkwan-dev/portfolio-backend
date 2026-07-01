import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '@/setup/filters/http-exception.filter';

export function setupFilters(app: INestApplication): void {
  app.useGlobalFilters(new HttpExceptionFilter());
}
