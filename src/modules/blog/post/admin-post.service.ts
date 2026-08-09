import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { AdminPostDetailDto } from '@/modules/blog/post/dto/admin-post-detail.dto';
import { AdminPostListItemDto } from '@/modules/blog/post/dto/admin-post-list-item.dto';
import { AdminPostListQueryDto } from '@/modules/blog/post/dto/admin-post-list-query.dto';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';

@Injectable()
export class AdminPostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postTagRepository: PostTagRepository,
  ) {}

  async findAll(query: AdminPostListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [posts, total] = await this.postRepository.findAllAdminPaginated(
      page,
      limit,
      query.isTemp,
    );

    return {
      data: await this.toListItemDtos(posts),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async findById(id: number): Promise<AdminPostDetailDto> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(`Post not found: ${id}`);

    const tagMap = await this.postTagRepository.findTagNamesByPostIds([post.id]);
    return this.toDetailDto(post, tagMap.get(post.id) ?? []);
  }

  private async toListItemDtos(posts: Post[]): Promise<AdminPostListItemDto[]> {
    if (posts.length === 0) return [];

    const tagMap = await this.postTagRepository.findTagNamesByPostIds(
      posts.map((p) => p.id),
    );

    return posts.map((post) =>
      plainToInstance(
        AdminPostListItemDto,
        {
          id: post.id,
          title: post.title,
          urlSlug: post.urlSlug,
          thumbnail: post.thumbnail,
          isTemp: post.isTemp,
          isMain: post.isMain,
          mainOrder: post.mainOrder,
          releasedAt: post.releasedAt,
          tags: tagMap.get(post.id) ?? [],
        },
        { excludeExtraneousValues: true },
      ),
    );
  }

  private toDetailDto(post: Post, tags: string[]): AdminPostDetailDto {
    return plainToInstance(
      AdminPostDetailDto,
      {
        id: post.id,
        title: post.title,
        urlSlug: post.urlSlug,
        shortDescription: post.shortDescription,
        thumbnail: post.thumbnail,
        body: post.body,
        isTemp: post.isTemp,
        isMain: post.isMain,
        mainOrder: post.mainOrder,
        releasedAt: post.releasedAt,
        seriesId: post.seriesId,
        seriesOrder: post.seriesOrder,
        tags,
      },
      { excludeExtraneousValues: true },
    );
  }
}
