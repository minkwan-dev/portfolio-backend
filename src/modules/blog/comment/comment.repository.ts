import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@/modules/blog/entities/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  findByPostId(postId: number): Promise<Comment[]> {
    return this.repository.find({
      where: { postId },
      order: { createdAt: 'ASC' },
    });
  }

  create(
    postId: number,
    data: Pick<Comment, 'nickname' | 'avatar' | 'body'>,
  ): Promise<Comment> {
    return this.repository.save(
      this.repository.create({ postId, ...data }),
    );
  }
}