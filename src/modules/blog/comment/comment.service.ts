import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { CommentHelper } from './comment.helper';
import { CommentRepository } from './comment.repository';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly helper: CommentHelper,
  ) {}

  async findByPostSlug(postSlug: string): Promise<CommentDto[]> {
    const post = await this.postRepository.findPublishedBySlug(postSlug);

    if (!post) throw new NotFoundException(`Post not found: ${postSlug}`);

    const comments = await this.commentRepository.findByPostId(post.id);

    return this.helper.toDtos(comments);
  }

  @Transactional()
  async create(postSlug: string, dto: CreateCommentDto): Promise<CommentDto> {
    const post = await this.postRepository.findPublishedBySlug(postSlug);

    if (!post) throw new NotFoundException(`Post not found: ${postSlug}`);

    this.helper.assertValidIdentity(dto.nickname, dto.avatar);

    const publishedPost = await this.postRepository.findPublishedById(post.id);
    if (!publishedPost) {
      throw new NotFoundException(`Post not found: id=${post.id}`);
    }

    const saved = await this.commentRepository.create(publishedPost.id, {
      nickname: dto.nickname,
      avatar: dto.avatar,
      body: dto.body,
    });

    await this.postRepository.incrementCommentsCount(publishedPost.id);

    return this.helper.toDto(saved);
  }
}