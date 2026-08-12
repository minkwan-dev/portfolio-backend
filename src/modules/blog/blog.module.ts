import { Module } from '@nestjs/common';
import { AdminPostModule } from '@/modules/blog/admin-post/admin-post.module';
import { PostModule } from '@/modules/blog/post/post.module';
import { CommentModule } from '@/modules/blog/comment/comment.module';

@Module({
  imports: [PostModule, AdminPostModule, CommentModule],
  exports: [PostModule],
})
export class BlogModule {}
