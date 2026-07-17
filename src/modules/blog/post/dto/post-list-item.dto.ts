import { Expose } from 'class-transformer';

export class PostListItemDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    urlSlug: string;

    @Expose()
    thumbnail: string | null;

    @Expose()
    releasedAt: Date | null;

    @Expose()
    tags: string[];
}