import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/modules/config/config.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { UserModule } from '@/modules/user/user.module';
import { SeriesModule } from '@/modules/series/series.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, UserModule, SeriesModule],
})

export class AppModule {}