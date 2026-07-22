import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/blog/post/post.module';

@Module({
  imports: [PostModule],
  exports: [PostModule],
})

export class BlogModule {}