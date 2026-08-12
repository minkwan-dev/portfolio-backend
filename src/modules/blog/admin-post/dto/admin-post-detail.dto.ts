import { Expose } from 'class-transformer';

export class AdminPostDetailDto {
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
    isTemp: boolean;

    @Expose()
    isMain: boolean;

    @Expose()
    mainOrder: number | null;

    @Expose()
    releasedAt: Date | null;

    @Expose()
    seriesId: number | null;

    @Expose()
    seriesOrder: number | null;

    @Expose()
    tags: string[];
}
