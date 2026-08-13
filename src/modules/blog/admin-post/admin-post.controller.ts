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

// @UseGuards(AdminTokenGuard)
@Controller('admin/posts')
export class AdminPostController {
  constructor(private readonly adminPostService: AdminPostService) {}

  @Get()
  async findAll(@Query() query: AdminPostListQueryDto) {
    return this.adminPostService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.adminPostService.findById(id);
    return { data };
  }

  @Post()
  async create(@Body() dto: CreateAdminPostDto) {
    const data = await this.adminPostService.create(dto);
    return { data };
  }

  @Patch(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    const data = await this.adminPostService.restore(id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminPostDto,
  ) {
    const data = await this.adminPostService.update(id, dto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.adminPostService.remove(id);
    return { data: null };
  }
}