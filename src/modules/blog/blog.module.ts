import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/blog/post/post.module';
import { CommentModule } from '@/modules/blog/comment/comment.module';

@Module({
  imports: [PostModule, CommentModule],
  exports: [PostModule],
})

export class BlogModule {}