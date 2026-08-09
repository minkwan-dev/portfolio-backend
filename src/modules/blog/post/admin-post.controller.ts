import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminPostService } from './admin-post.service';
import { AdminPostListQueryDto } from './dto/admin-post-list-query.dto';
import { CreateAdminPostDto } from './dto/create-admin-post.dto';
import { UpdateAdminPostDto } from './dto/update-admin-post.dto';

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

  @Post()
  create(@Body() dto: CreateAdminPostDto) {
    return this.adminPostService.create(dto).then((data) => ({ data }));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminPostDto,
  ) {
    return this.adminPostService.update(id, dto).then((data) => ({ data }));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.adminPostService.remove(id);
    return { data: null };
  }
}
