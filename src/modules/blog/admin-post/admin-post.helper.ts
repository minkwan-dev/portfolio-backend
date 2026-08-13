import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { PostTagRepository } from '@/modules/blog/post/post-tag.repository';
import { AdminPostDetailDto } from './dto/admin-post-detail.dto';
import { AdminPostListItemDto } from './dto/admin-post-list-item.dto';
import { CreateAdminPostDto } from './dto/create-admin-post.dto';
import { UpdateAdminPostDto } from './dto/update-admin-post.dto';
import { TagRepository } from './tag.repository';
import {
  generateDraftSlug,
  resolveReleasedAt,
  slugFromTitle,
} from './utils/admin-post-slug.util';

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
    const title = dto.title?.trim() || '제목 없음';
    const urlSlug = dto.isTemp ? generateDraftSlug() : slugFromTitle(title);

    return {
      title,
      urlSlug,
      shortDescription: null,
      thumbnail: dto.thumbnail ?? null,
      body: dto.body?.trim() || ' ',
      isTemp: dto.isTemp,
      isMain: dto.isMain ?? false,
      mainOrder: dto.mainOrder ?? null,
      releasedAt: resolveReleasedAt(dto.isTemp),
      seriesId: dto.seriesId ?? null,
      seriesOrder: dto.seriesOrder ?? null,
    };
  }

  buildUpdatePayload(
    post: Post,
    dto: Omit<UpdateAdminPostDto, 'tags'>,
  ): Partial<Post> {
    const payload: Partial<Post> = {};
    const nextIsTemp = dto.isTemp ?? post.isTemp;

    if (dto.title !== undefined) payload.title = dto.title;
    if (dto.thumbnail !== undefined) payload.thumbnail = dto.thumbnail;
    if (dto.body !== undefined) payload.body = dto.body;
    if (dto.isTemp !== undefined) payload.isTemp = dto.isTemp;
    if (dto.isMain !== undefined) payload.isMain = dto.isMain;
    if (dto.mainOrder !== undefined) payload.mainOrder = dto.mainOrder;
    if (dto.seriesId !== undefined) payload.seriesId = dto.seriesId;
    if (dto.seriesOrder !== undefined) payload.seriesOrder = dto.seriesOrder;

    if (post.isTemp && !nextIsTemp) {
      const title = dto.title?.trim() ?? post.title;
      payload.urlSlug = slugFromTitle(title);
    }

    payload.releasedAt = resolveReleasedAt(nextIsTemp);
    payload.shortDescription = null;

    return payload;
  }

  async findAvailableSlug(
    baseSlug: string,
    excludeId?: number,
  ): Promise<string> {
    let candidate = baseSlug;
    let suffix = 2;

    while (true) {
      const existing = await this.postRepository.findByUrlSlug(candidate);
      if (!existing || existing.id === excludeId) {
        return candidate;
      }

      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
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
