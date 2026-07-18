import { Controller, Get, Query } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostsBySlugsQueryDto } from "./dto/posts-by-slugs-query.dto";

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async findBySlugs(@Query() query: PostsBySlugsQueryDto) {
        const slugList = query.slugs
            .split(',')
            .map((slug) => slug.trim())
            .filter(Boolean);

        const data = await this.postService.findBySlugs(slugList);

        return { data }
    }
}