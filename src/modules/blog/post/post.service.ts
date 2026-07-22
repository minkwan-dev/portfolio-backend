import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostDetailDto } from '@/modules/blog/post/dto/post-detail.dto';
import { PostListItemDto } from '@/modules/blog/post/dto/post-list-item.dto';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postTagRepository: PostTagRepository,
  ) {}

  async findMain(): Promise<PostListItemDto[]> {
    const posts = await this.postRepository.findMain();
    return this.toListItemDtos(posts);
  }

  async findAll(): Promise<PostListItemDto[]> {
    const posts = await this.postRepository.findAllPublished();
    return this.toListItemDtos(posts);
  }

  async findBySlug(slug: string): Promise<PostDetailDto> {
    const post = await this.postRepository.findPublishedBySlug(slug);
    if (!post) throw new NotFoundException(`Post not found: ${slug}`);

    const tagMap = await this.postTagRepository.findTagNamesByPostIds([post.id]);
    return this.toDetailDto(post, tagMap.get(post.id) ?? []);
  }

  private async toListItemDtos(posts: Post[]): Promise<PostListItemDto[]> {
    if (posts.length === 0) return [];

    const tagMap = await this.postTagRepository.findTagNamesByPostIds(
      posts.map((p) => p.id),
    );

    return posts.map((post) =>
      plainToInstance(
        PostListItemDto,
        {
          id: post.id,
          title: post.title,
          urlSlug: post.urlSlug,
          thumbnail: post.thumbnail,
          releasedAt: post.releasedAt,
          tags: tagMap.get(post.id) ?? [],
        },
        { excludeExtraneousValues: true },
      ),
    );
  }

  private toDetailDto(post: Post, tags: string[]): PostDetailDto {
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
        tags,
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