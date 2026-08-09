import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostListQueryDto } from './dto/post-list-query.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}
    
    @Get('main')
    async findMain() {
        const data = await this.postService.findMain();
        return { data };
    }

    @Get()
    async findAll(@Query() query: PostListQueryDto) {
        return this.postService.findAll(query);
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        const data = await this.postService.findBySlug(slug);
        return { data };
    }
}