import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { AdminPostDetailDto } from '@/modules/blog/post/dto/admin-post-detail.dto';
import { AdminPostListItemDto } from '@/modules/blog/post/dto/admin-post-list-item.dto';
import { AdminPostListQueryDto } from '@/modules/blog/post/dto/admin-post-list-query.dto';
import { CreateAdminPostDto } from '@/modules/blog/post/dto/create-admin-post.dto';
import { UpdateAdminPostDto } from '@/modules/blog/post/dto/update-admin-post.dto';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';
import { TagRepository } from '@/modules/blog/post/tag.repository';

@Injectable()
export class AdminPostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postTagRepository: PostTagRepository,
    private readonly tagRepository: TagRepository,
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

  async create(dto: CreateAdminPostDto): Promise<AdminPostDetailDto> {
    await this.assertUniqueSlug(dto.urlSlug);

    const post = await this.postRepository.create({
      title: dto.title,
      urlSlug: dto.urlSlug,
      shortDescription: dto.shortDescription ?? null,
      thumbnail: dto.thumbnail ?? null,
      body: dto.body,
      isTemp: dto.isTemp,
      isMain: dto.isMain ?? false,
      mainOrder: dto.mainOrder ?? null,
      releasedAt: dto.releasedAt ?? null,
      seriesId: dto.seriesId ?? null,
      seriesOrder: dto.seriesOrder ?? null,
    });

    await this.syncTags(post.id, dto.tags);
    return this.findById(post.id);
  }

  async update(id: number, dto: UpdateAdminPostDto): Promise<AdminPostDetailDto> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(`Post not found: ${id}`);

    if (dto.urlSlug && dto.urlSlug !== post.urlSlug) {
      await this.assertUniqueSlug(dto.urlSlug, id);
    }

    const updatePayload = this.buildUpdatePayload(dto);
    if (Object.keys(updatePayload).length > 0) {
      const updated = await this.postRepository.updateById(id, updatePayload);
      if (!updated) throw new NotFoundException(`Post not found: ${id}`);
    }

    if (dto.tags) await this.syncTags(id, dto.tags);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(`Post not found: ${id}`);

    await this.postRepository.deleteById(id);
  }

  private buildUpdatePayload(dto: UpdateAdminPostDto): Partial<Post> {
    const payload: Partial<Post> = {};

    if (dto.title !== undefined) payload.title = dto.title;
    if (dto.urlSlug !== undefined) payload.urlSlug = dto.urlSlug;
    if (dto.shortDescription !== undefined) {
      payload.shortDescription = dto.shortDescription;
    }
    if (dto.thumbnail !== undefined) payload.thumbnail = dto.thumbnail;
    if (dto.body !== undefined) payload.body = dto.body;
    if (dto.isTemp !== undefined) payload.isTemp = dto.isTemp;
    if (dto.isMain !== undefined) payload.isMain = dto.isMain;
    if (dto.mainOrder !== undefined) payload.mainOrder = dto.mainOrder;
    if (dto.releasedAt !== undefined) payload.releasedAt = dto.releasedAt;
    if (dto.seriesId !== undefined) payload.seriesId = dto.seriesId;
    if (dto.seriesOrder !== undefined) payload.seriesOrder = dto.seriesOrder;

    return payload;
  }

  private async assertUniqueSlug(
    urlSlug: string,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.postRepository.findByUrlSlug(urlSlug);
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`Slug already exists: ${urlSlug}`);
    }
  }

  private async syncTags(postId: number, tagNames: string[]): Promise<void> {
    const tags = await this.tagRepository.findOrCreateByNames(tagNames);
    await this.postTagRepository.replaceForPost(
      postId,
      tags.map((tag) => tag.id),
    );
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
