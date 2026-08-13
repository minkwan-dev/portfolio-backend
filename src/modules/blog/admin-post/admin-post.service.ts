import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { AdminPostHelper } from './admin-post.helper';
import { AdminPostDetailDto } from './dto/admin-post-detail.dto';
import { AdminPostListQueryDto } from './dto/admin-post-list-query.dto';
import { CreateAdminPostDto } from './dto/create-admin-post.dto';
import { UpdateAdminPostDto } from './dto/update-admin-post.dto';

@Injectable()
export class AdminPostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly helper: AdminPostHelper,
  ) {}

  async findAll(query: AdminPostListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [posts, total] = await this.postRepository.findAllAdminPaginated(
      page,
      limit,
      { isTemp: query.isTemp, isDeleted: query.isDeleted },
    );

    const sources = await this.helper.attachTags(posts);

    return {
      data: this.helper.toListItemDtos(sources),
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

    const [postWithTags] = await this.helper.attachTags([post]);
    return this.helper.toDetailDto(postWithTags);
  }

  @Transactional()
  async create(dto: CreateAdminPostDto): Promise<AdminPostDetailDto> {
    const { tags, ...input } = dto;
    const payload = this.helper.buildCreatePayload(input);

    await this.helper.assertUniqueSlug(payload.urlSlug!);

    const post = await this.postRepository.create(payload);
    await this.helper.syncTags(post.id, tags);

    return this.findById(post.id);
  }

  @Transactional()
  async update(id: number, dto: UpdateAdminPostDto): Promise<AdminPostDetailDto> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(`Post not found: ${id}`);

    if (dto.urlSlug && dto.urlSlug !== post.urlSlug) {
      await this.helper.assertUniqueSlug(dto.urlSlug, id);
    }

    const { tags, ...input } = dto;
    const updatePayload = this.helper.buildUpdatePayload(input);

    if (Object.keys(updatePayload).length > 0) {
      const updated = await this.postRepository.updateById(id, updatePayload);
      if (!updated) throw new NotFoundException(`Post not found: ${id}`);
    }

    if (tags) await this.helper.syncTags(id, tags);

    return this.findById(id);
  }

  @Transactional()
  async remove(id: number): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(`Post not found: ${id}`);

    await this.postRepository.softDeleteById(id);
  }

  @Transactional()
  async restore(id: number): Promise<AdminPostDetailDto> {
    const post = await this.postRepository.findByIdWithDeleted(id);
    if (!post?.deletedAt) {
      throw new NotFoundException(`Deleted post not found: ${id}`);
    }

    const restoredSlug = post.urlSlug.replace(/__deleted__\d+$/, '');
    const existing = await this.postRepository.findByUrlSlug(restoredSlug);
    if (existing) {
      throw new ConflictException(`Slug already exists: ${restoredSlug}`);
    }

    await this.postRepository.updateById(id, { urlSlug: restoredSlug });
    await this.postRepository.recoverById(id);

    return this.findById(id);
  }
}