import { Expose } from 'class-transformer';

export class CommentIdentityDto {
    @Expose()
    nickname: string;

    @Expose()
    avatar: string;
}