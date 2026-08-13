import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/modules/blog/entities/comment.entity';
import { PostModule } from '@/modules/blog/post/post.module';
import { CommentController } from './comment.controller';
import { CommentHelper } from './comment.helper';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostModule],
  controllers: [CommentController],
  providers: [CommentRepository, CommentHelper, CommentService],
})
export class CommentModule {}