import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Comment } from '@/modules/blog/entities/comment.entity';
import { ADJECTIVES, ALLOWED_AVATARS, NAMES } from './comment.constants';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentHelper {
  assertValidIdentity(nickname: string, avatar: string): void {
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

  toDto(comment: Comment): CommentDto {
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

  toDtos(comments: Comment[]): CommentDto[] {
    return comments.map((comment) => this.toDto(comment));
  }
}
