import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostTag } from '@/modules/blog/entities/post-tag.entity';
import { Tag } from '@/modules/blog/entities/tag.entity';
import { Series } from '@/modules/blog/entities/series.entity';
import { PostController } from './post.controller';
import { PostService } from '@/modules/blog/post/post.service';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTag, Tag, Series])],
  controllers: [PostController],
  providers: [PostRepository, PostTagRepository, PostService],
  exports: [PostRepository, PostService],
})

export class PostModule {}