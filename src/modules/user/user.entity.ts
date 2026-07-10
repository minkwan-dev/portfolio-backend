import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/modules/database/base.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'google_sub', type: 'varchar', length: 255, unique: true })
  googleSub: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  picture: string | null;
}