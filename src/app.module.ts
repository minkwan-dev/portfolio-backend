import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/modules/config/config.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { BlogModule } from './modules/blog/blog.module';

const infrastructureMoudules = [AppConfigModule, DatabaseModule];
const featureModules = [BlogModule];

@Module({
  imports: [...infrastructureMoudules, ...featureModules],
})

export class AppModule {}