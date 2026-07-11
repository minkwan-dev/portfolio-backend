import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/modules/database/base.entity';
import { Series } from '@/modules/blog/entities/series.entity';

@Entity('post')
export class Post extends BaseEntity {
    @Column({ name: 'series_id', type: 'int', nullable: true })
    seriesId: number | null;

    @Column({ name: 'series_order', type: 'int', nullable: true })
    seriesOrder: number | null;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ name: 'short_description', type: 'varchar', length: 255, nullable: true })
    shortDescription: string | null;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    thumbnail: string | null;

    @Column({ type: 'longtext' })
    body: string;

    @Column({ name: 'url_slug', type: 'varchar', length: 255, unique: true })
    urlSlug: string;

    @Column({ name: 'is_temp', type: 'boolean', default: false })
    isTemp: boolean;

    @Column({ name: 'comments_count', type: 'int', default: 0 })
    commentsCount: number;

    @Column({ name: 'released_at', type: 'datetime', nullable: true })
    releasedAt: Date | null;

    @ManyToOne(() => Series, { nullable: true })
    @JoinColumn({ name: 'series_id' })
    series: Series | null;
}