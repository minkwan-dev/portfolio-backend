import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from '@/modules/post/post.entity';
import { Tag } from '@/modules/tag/tag.entity';

@Entity('post_tag')
export class PostTag {
    @PrimaryColumn({ name: 'post_id' })
    postId: number;

    @PrimaryColumn({ name: 'tag_id' })
    tagId: number;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
}