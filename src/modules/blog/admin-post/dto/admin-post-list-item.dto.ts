import { Expose } from 'class-transformer';

export class AdminPostListItemDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    urlSlug: string;

    @Expose()
    thumbnail: string | null;

    @Expose()
    isTemp: boolean;

    @Expose()
    isMain: boolean;

    @Expose()
    mainOrder: number | null;

    @Expose()
    releasedAt: Date | null;

    @Expose()
    tags: string[];
}
