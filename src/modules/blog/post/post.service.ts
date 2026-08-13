import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDetailDto } from '@/modules/blog/post/dto/post-detail.dto';
import { PostListItemDto } from '@/modules/blog/post/dto/post-list-item.dto';
import { PostListQueryDto } from '@/modules/blog/post/dto/post-list-query.dto';
import { PostHelper } from '@/modules/blog/post/post.helper';
import { PostRepository } from '@/modules/blog/post/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly helper: PostHelper,
  ) {}

  async findMain(): Promise<PostListItemDto[]> {
    const posts = await this.postRepository.findMain();
    const sources = await this.helper.attachTags(posts);
    return this.helper.toListItemDtos(sources);
  }

  async findPublishedPage(query: PostListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const rows = await this.postRepository.findPublishedPage(page, limit);

    const hasNextPage = rows.length > limit;
    const posts = rows.slice(0, limit);

    const sources = await this.helper.attachTags(posts);

    return {
      data: this.helper.toListItemDtos(sources),
      meta: {
        page,
        limit,
        hasNextPage,
      },
    };
  }

  async findBySlug(slug: string): Promise<PostDetailDto> {
    const post = await this.postRepository.findPublishedBySlug(slug);
    if (!post) throw new NotFoundException(`Post not found: ${slug}`);

    const [postWithTags] = await this.helper.attachTags([post]);
    return this.helper.toDetailDto(postWithTags);
  }
}
