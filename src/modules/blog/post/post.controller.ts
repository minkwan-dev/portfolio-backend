import { Controller, Get, Param } from '@nestjs/common';
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
    async findAll() {
        const data = await this.postService.findAll();
        return { data };
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        const data = await this.postService.findBySlug(slug);
        return { data };
    }
}