import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAdminPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  urlSlug: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  shortDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  thumbnail?: string | null;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsBoolean()
  isTemp: boolean;

  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mainOrder?: number | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releasedAt?: Date | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seriesId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seriesOrder?: number | null;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
