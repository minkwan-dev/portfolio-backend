import { Expose } from 'class-transformer';

class PostSeriesSummaryDto {
    @Expose()
    name: string;

    @Expose()
    urlSlug: string;

    @Expose()
    order: number | null;
}

export class PostDetailDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    urlSlug: string;

    @Expose()
    shortDescription: string | null;

    @Expose()
    thumbnail: string | null;

    @Expose()
    body: string;

    @Expose()
    releasedAt: Date | null;

    @Expose()
    commentsCount: number;

    @Expose()
    tags: string[];

    @Expose()
    series: PostSeriesSummaryDto | null;
}