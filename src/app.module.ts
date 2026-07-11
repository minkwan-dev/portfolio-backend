import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/modules/config/config.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    BlogModule
  ],
})

export class AppModule {}