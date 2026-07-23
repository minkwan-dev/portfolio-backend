import { Expose } from 'class-transformer';

export class CommentDto {
    @Expose()
    id: number;

    @Expose()
    nickname: string;

    @Expose()
    avatar: string;

    @Expose()
    body: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}