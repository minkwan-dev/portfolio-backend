import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/modules/config/config.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { PostModule } from '@/modules/post/post.module';
import { SeriesModule } from '@/modules/series/series.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UserModule,
    SeriesModule,
    PostModule,
  ],
})

export class AppModule {}