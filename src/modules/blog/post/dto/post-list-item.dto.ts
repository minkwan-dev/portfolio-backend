import { Expose, Type } from "class-transformer";
import { PostSeriesSummaryDto } from "./post-series-summary.dto";

export class PostListItemDto {
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
    releasedAt: Date | null;

    @Expose()
    @Type(() => PostSeriesSummaryDto)
    series: PostSeriesSummaryDto | null;

    @Expose()
    tags: string[];

    @Expose()
    commentsCount: number;
}