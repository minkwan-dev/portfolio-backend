import { Module, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { HttpExceptionFilter } from '@/setup/filters/http-exception.filter';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER, Reflector } from '@nestjs/core';

import { AppConfigModule } from '@/modules/config/config.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { BlogModule } from '@/modules/blog/blog.module';

const infrastructureModules = [AppConfigModule, DatabaseModule];
const featureModules = [BlogModule];

@Module({
  imports: [...infrastructureModules, ...featureModules],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) => new ClassSerializerInterceptor(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ]
})

export class AppModule {}