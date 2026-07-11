import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from '@/modules/blog/entities/post.entity';
import { Tag } from '@/modules/blog/entities/tag.entity';

@Entity('post_tag')
export class PostTag {
    @PrimaryColumn({ name: 'post_id', type: 'int' })
    postId: number;

    @PrimaryColumn({ name: 'tag_id', type: 'int' })
    tagId: number;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
}