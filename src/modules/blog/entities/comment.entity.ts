import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/modules/database/base.entity';
import { Post } from '@/modules/blog/entities/post.entity';

@Entity('comment')
export class Comment extends BaseEntity {
    @Column({ name: 'post_id', type: 'int' })
    postId: number;

    @Column({ type: 'varchar', length: 50 })
    nickname: string;

    @Column({ type: 'varchar', length: 512 })
    avatar: string;

    @Column({ type: 'text' })
    body: string;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;
}