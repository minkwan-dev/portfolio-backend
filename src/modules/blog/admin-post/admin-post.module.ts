import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '@/modules/blog/entities/tag.entity';
import { PostModule } from '@/modules/blog/post/post.module';
import { AdminPostController } from './admin-post.controller';
import { AdminPostService } from './admin-post.service';
import { TagRepository } from './tag.repository';

@Module({
  imports: [PostModule, TypeOrmModule.forFeature([Tag])],
  controllers: [AdminPostController],
  providers: [AdminPostService, TagRepository],
})
export class AdminPostModule {}
