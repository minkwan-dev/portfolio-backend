import { Expose } from 'class-transformer'

export class PostSeriesSummaryDto {
    @Expose()
    urlSlug: string;

    @Expose()
    name: string;
}