import { ConflictException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';
import { AdminPostDetailDto } from './dto/admin-post-detail.dto';
import { AdminPostListItemDto } from './dto/admin-post-list-item.dto';
import { CreateAdminPostDto } from './dto/create-admin-post.dto';
import { UpdateAdminPostDto } from './dto/update-admin-post.dto';
import { TagRepository } from './tag.repository';

type PostWithTags = Post & { tags: string[] };

const PLAIN_TO_INSTANCE_OPTIONS = { excludeExtraneousValues: true } as const;

@Injectable()
export class AdminPostHelper {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postTagRepository: PostTagRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async attachTags(posts: Post[]): Promise<PostWithTags[]> {
    const tagMap = await this.postTagRepository.findTagNamesByPostIds(
      posts.map((p) => p.id),
    );

    return posts.map((post) => ({
      ...post,
      tags: tagMap.get(post.id) ?? [],
    }));
  }

  buildCreatePayload(dto: Omit<CreateAdminPostDto, 'tags'>): Partial<Post> {
    return {
      title: dto.title?.trim() || '제목 없음',
      urlSlug:
        dto.urlSlug?.trim() ||
        `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      shortDescription: dto.shortDescription ?? null,
      thumbnail: dto.thumbnail ?? null,
      body: dto.body?.trim() || ' ',
      isTemp: dto.isTemp,
      isMain: dto.isMain ?? false,
      mainOrder: dto.mainOrder ?? null,
      releasedAt: dto.releasedAt ?? null,
      seriesId: dto.seriesId ?? null,
      seriesOrder: dto.seriesOrder ?? null,
    };
  }

  buildUpdatePayload(dto: Omit<UpdateAdminPostDto, 'tags'>): Partial<Post> {
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

  async assertUniqueSlug(urlSlug: string, excludeId?: number): Promise<void> {
    const existing = await this.postRepository.findByUrlSlug(urlSlug);
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`Slug already exists: ${urlSlug}`);
    }
  }

  async syncTags(postId: number, tagNames: string[]): Promise<void> {
    const uniqueNames = [
      ...new Set(tagNames.map((name) => name.trim()).filter(Boolean)),
    ];

    await this.tagRepository.createIgnoringDuplicates(uniqueNames);
    const tags = await this.tagRepository.findByNames(uniqueNames);

    await this.postTagRepository.replaceForPost(
      postId,
      tags.map((tag) => tag.id),
    );
  }

  toListItemDtos(sources: PostWithTags[]): AdminPostListItemDto[] {
    return sources.map((source) =>
      plainToInstance(AdminPostListItemDto, source, PLAIN_TO_INSTANCE_OPTIONS),
    );
  }

  toDetailDto(source: PostWithTags): AdminPostDetailDto {
    return plainToInstance(AdminPostDetailDto, source, PLAIN_TO_INSTANCE_OPTIONS);
  }
}
