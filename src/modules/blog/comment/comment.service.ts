import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Comment } from '@/modules/blog/entities/comment.entity';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { CommentRepository } from './comment.repository';
import { ADJECTIVES, ALLOWED_AVATARS, NAMES } from './comment.constants';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postRepository: PostRepository,
    ) {}

    async findByPostSlug(postSlug: string): Promise<CommentDto[]> {
        const post = await this.postRepository.findPublishedBySlug(postSlug);

        if (!post) throw new NotFoundException(`Post not found: ${postSlug}`);

        const comments = await this.commentRepository.findByPostId(post.id);

        return comments.map((comment) => this.toDto(comment));
    }

    async create(postSlug: string, dto: CreateCommentDto): Promise<CommentDto> {
        const post = await this.postRepository.findPublishedBySlug(postSlug);

        if (!post) throw new NotFoundException(`Post not found: ${postSlug}`);

        this.assertValidIdentity(dto.nickname, dto.avatar);

        const saved = await this.commentRepository.createWithCountUpdate(post.id, {
            nickname: dto.nickname,
            avatar: dto.avatar,
            body: dto.body,
        });

        return this.toDto(saved);
    }

    private assertValidIdentity(nickname: string, avatar: string): void {
        const isValidAvatar = (ALLOWED_AVATARS as readonly string[]).includes(avatar);

        if (!isValidAvatar) {
            throw new BadRequestException('Invalid avatar URL');
        }

        const isValidNickname = ADJECTIVES.some((adj) =>
            NAMES.some((name) => nickname === `${adj} ${name}`),
        );

        if (!isValidNickname) {
            throw new BadRequestException('Invalid nickname');
        }
    }

    private toDto(comment: Comment): CommentDto {
        return plainToInstance(
            CommentDto,
            {
                id: comment.id,
                nickname: comment.nickname,
                avatar: comment.avatar,
                body: comment.body,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            },
            { excludeExtraneousValues: true },
        );
    }
}