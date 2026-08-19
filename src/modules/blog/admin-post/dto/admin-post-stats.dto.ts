import { Expose } from 'class-transformer';

export class AdminPostStatsDto {
  @Expose()
  total: number;

  @Expose()
  published: number;

  @Expose()
  draft: number;

  @Expose()
  main: number;
}
