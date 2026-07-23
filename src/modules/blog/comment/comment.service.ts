import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Comment } from '@/modules/blog/entities/comment.entity';
import { PostRepository } from '@/modules/blog/post/post.repository';
import { CommentRepository } from './comment.repository';
import {
  ADJECTIVES,
  NAMES,
  CommentIdentityService,
  DICEBEAR_STYLE,
} from './comment-identity.service';
import { CommentDto } from './dto/comment.dto';
import { CommentIdentityDto } from './dto/comment-identity.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

const DICEBEAR_AVATAR_PREFIX = `https://api.dicebear.com/10.x/${DICEBEAR_STYLE}/svg?seed=`;

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postRepository: PostRepository,
        private readonly commentIdentityService: CommentIdentityService,
    ) {}

    previewIdentity(): CommentIdentityDto {
        return plainToInstance(
            CommentIdentityDto, 
            this.commentIdentityService.generate(), 
            { excludeExtraneousValues: true }
        );
    }

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
        if (!avatar.startsWith(DICEBEAR_AVATAR_PREFIX)) {
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