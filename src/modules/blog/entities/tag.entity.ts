import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tag')
export class Tag {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;
}