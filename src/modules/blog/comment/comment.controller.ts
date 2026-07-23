import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('comments/identity')
    previewIdentity() {
        const data = this.commentService.previewIdentity();
        return { data };
    }

    @Get('posts/:postSlug/comments')
    async findByPost(@Param('postSlug') postSlug: string) {
        const data = await this.commentService.findByPostSlug(postSlug);
        return { data };
    }

    @Post('posts/:postSlug/comments')
    async create(@Param('postSlug') postSlug: string, @Body() dto: CreateCommentDto) {
        const data = await this.commentService.create(postSlug, dto);
        return { data };
    }
}