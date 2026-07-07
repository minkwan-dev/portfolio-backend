import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/modules/database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'thumbnail_img', type: 'varchar', length: 500, nullable: true })
  thumbnailImg: string | null;

  @Column({ name: 'short_bio', type: 'text', nullable: true })
  shortBio: string | null;

  @Column({ type: 'varchar', length: 50 })
  provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;
}