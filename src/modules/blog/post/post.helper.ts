import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostDetailDto } from '@/modules/blog/post/dto/post-detail.dto';
import { PostListItemDto } from '@/modules/blog/post/dto/post-list-item.dto';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';

type PostWithTags = Post & { tags: string[] };

@Injectable()
export class PostHelper {
  constructor(private readonly postTagRepository: PostTagRepository) {}

  async attachTags(posts: Post[]): Promise<PostWithTags[]> {
    const tagMap = await this.postTagRepository.findTagNamesByPostIds(
      posts.map((p) => p.id),
    );

    return posts.map((post) => ({
      ...post,
      tags: tagMap.get(post.id) ?? [],
    }));
  }

  toListItemDtos(sources: PostWithTags[]): PostListItemDto[] {
    return sources.map((source) =>
      plainToInstance(PostListItemDto, source, {
        excludeExtraneousValues: true,
      }),
    );
  }

  toDetailDto(post: PostWithTags): PostDetailDto {
    return plainToInstance(
      PostDetailDto,
      {
        id: post.id,
        title: post.title,
        urlSlug: post.urlSlug,
        shortDescription: post.shortDescription,
        thumbnail: post.thumbnail,
        body: post.body,
        releasedAt: post.releasedAt,
        commentsCount: post.commentsCount,
        tags: post.tags,
        series: post.series
          ? {
              name: post.series.name,
              urlSlug: post.series.urlSlug,
              order: post.seriesOrder,
            }
          : null,
      },
      { excludeExtraneousValues: true },
    );
  }
}
