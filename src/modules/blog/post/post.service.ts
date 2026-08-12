import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostDetailDto } from '@/modules/blog/post/dto/post-detail.dto';
import { PostListItemDto } from '@/modules/blog/post/dto/post-list-item.dto';
import { PostListQueryDto } from '@/modules/blog/post/dto/post-list-query.dto';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';

type PostWithTags = Post & { tags: string[] };

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postTagRepository: PostTagRepository,
  ) {}

  async findMain(): Promise<PostListItemDto[]> {
    const posts = await this.postRepository.findMain();
    const sources = await this.attachTags(posts);
    return this.toListItemDtos(sources);
  }

  async findPublishedPage(query: PostListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const rows = await this.postRepository.findPublishedPage(page, limit);

    const hasNextPage = rows.length > limit;
    const posts = rows.slice(0, limit);

    const sources = await this.attachTags(posts);

    return {
      data: this.toListItemDtos(sources),
      meta: {
        page,
        limit,
        hasNextPage,
      },
    };
  }

  async findBySlug(slug: string): Promise<PostDetailDto> {
    const post = await this.postRepository.findPublishedBySlug(slug);
    if (!post) throw new NotFoundException(`Post not found: ${slug}`);

    const [postWithTags] = await this.attachTags([post]);
    return this.toDetailDto(postWithTags);
  }

  private async attachTags(posts: Post[]): Promise<PostWithTags[]> {
    const tagMap = await this.postTagRepository.findTagNamesByPostIds(
      posts.map((p) => p.id),
    );

    return posts.map((post) => ({
      ...post,
      tags: tagMap.get(post.id) ?? [],
    }));
  }

  private toListItemDto(source: PostWithTags): PostListItemDto {
    return plainToInstance(PostListItemDto, source, {
      excludeExtraneousValues: true,
    });
  }

  private toListItemDtos(sources: PostWithTags[]): PostListItemDto[] {
    return sources.map((source) => this.toListItemDto(source));
  }

  private toDetailDto(post: PostWithTags): PostDetailDto {
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