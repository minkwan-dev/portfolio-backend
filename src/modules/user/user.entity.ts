import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
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
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }