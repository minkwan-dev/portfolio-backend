import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/modules/comment/comment.entity';
import { Post } from '@/modules/post/post.entity';
import { PostTag } from '@/modules/post/post-tag.entity';
import { Tag } from '@/modules/tag/tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostTag, Tag, Comment])],
})

export class PostModule {}