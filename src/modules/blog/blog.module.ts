import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/modules/blog/entities/comment.entity';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostTag } from '@/modules/blog/entities/post-tag.entity';
import { Series } from '@/modules/blog/entities/series.entity';
import { Tag } from '@/modules/blog/entities/tag.entity';
import { PostService } from '@/modules/blog/post/post.service';
import { PostController } from '@/modules/blog/post/post.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Series, Post, Tag, PostTag, Comment]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})

export class BlogModule {}