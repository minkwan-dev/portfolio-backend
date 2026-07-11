import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/modules/database/base.entity';

@Entity('series')
export class Series extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string | null;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    thumbnail: string | null;

    @Column({ name: 'url_slug', type: 'varchar', length: 50, unique: true })
    urlSlug: string;
}