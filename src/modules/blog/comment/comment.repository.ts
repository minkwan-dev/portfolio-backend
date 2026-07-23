import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '@/modules/blog/entities/comment.entity';
import { Post } from '@/modules/blog/entities/post.entity';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(Comment)
        private readonly repository: Repository<Comment>,
        private readonly dataSource: DataSource,
    ) {}

    findByPostId(postId: number): Promise<Comment[]> {
        return this.repository.find({
            where: { postId },
            order: { createdAt: 'ASC' },
        });
    }

    createWithCountUpdate(
        postId: number,
        data: Pick<Comment, 'nickname' | 'avatar' | 'body'>,
      ): Promise<Comment> {
        return this.dataSource.transaction(async (manager) => {
            const post = await manager.findOne(Post, {
                where: { id: postId, isTemp: false },
            });
            
            if (!post) throw new NotFoundException(`Post not found: id=${postId}`);
    
            const saved = await manager.save(
                manager.create(Comment, { postId, ...data }),
            );
            
            await manager.increment(Post, { id: postId }, 'commentsCount', 1);
            
            return saved;
        });
    }
}