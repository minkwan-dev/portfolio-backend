import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { TransformQueryBoolean } from '../utils/query-boolean.util';

export class AdminPostListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @IsOptional()
  @TransformQueryBoolean()
  @IsBoolean()
  isTemp?: boolean;

  @IsOptional()
  @TransformQueryBoolean()
  @IsBoolean()
  isDeleted?: boolean;
}
