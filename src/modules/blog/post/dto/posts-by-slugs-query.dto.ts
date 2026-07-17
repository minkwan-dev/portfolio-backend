import { IsString } from 'class-validator';

export class PostsBySlugsQueryDto {
  @IsString()
  slugs: string;
}