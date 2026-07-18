import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostTag } from '@/modules/blog/entities/post-tag.entity';
import { PostListItemDto } from '@/modules/blog/post/dto/post-list-item.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostTag)
        private readonly postTagRepository: Repository<PostTag>,
    ) {}

    async findBySlugs(requestedSlugs: string[]): Promise<PostListItemDto[]> {
        if (requestedSlugs.length === 0) return [];
    
        const postsFromDB = await this.postRepository.find({
        where: { urlSlug: In(requestedSlugs), isTemp: false },
        });
    
        const dtos = await this.buildPostListItemDtos(postsFromDB);
    
        const orderedDtos: PostListItemDto[] = [];

        for (const slug of requestedSlugs) {
        const dto = dtos.find((item) => item.urlSlug === slug);
        if (dto) orderedDtos.push(dto);
        }
    
        return orderedDtos;
    }
  
    private async buildPostListItemDtos(posts: Post[]): Promise<PostListItemDto[]> {
        if (posts.length === 0) return [];
    
        const postIds = posts.map((post) => post.id);
        const postTagLinks = await this.fetchPostTagLinks(postIds);
    
        return posts.map((post) => {
        const tagNames = this.getTagNamesForPost(post.id, postTagLinks);
        return this.toPostListItemDto(post, tagNames);
        });
    }
  
    private async fetchPostTagLinks(postIds: number[]): Promise<PostTag[]> {
        return this.postTagRepository.find({
        where: { postId: In(postIds) },
        relations: { tag: true },
        });
    }
  
    private getTagNamesForPost(postId: number, postTagLinks: PostTag[]): string[] {
        const linksForPost = postTagLinks.filter((link) => link.postId === postId);
        return linksForPost.map((link) => link.tag.name);
    }
  
    private toPostListItemDto(post: Post, tagNames: string[]): PostListItemDto {return plainToInstance(
        PostListItemDto,
        {
            id: post.id,
            title: post.title,
            urlSlug: post.urlSlug,
            thumbnail: post.thumbnail,
            releasedAt: post.releasedAt,
            tags: tagNames,
        },
        { excludeExtraneousValues: true },
        );
    }
}