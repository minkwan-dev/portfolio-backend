import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AdminPostService } from './admin-post.service';
import { AdminPostListQueryDto } from './dto/admin-post-list-query.dto';

@Controller('admin/posts')
export class AdminPostController {
  constructor(private readonly adminPostService: AdminPostService) {}

  @Get()
  findAll(@Query() query: AdminPostListQueryDto) {
    return this.adminPostService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminPostService.findById(id).then((data) => ({ data }));
  }
}
