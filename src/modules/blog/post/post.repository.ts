import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { Post } from '@/modules/blog/entities/post.entity';

const POST_LIST_SELECT = {
  id: true,
  title: true,
  urlSlug: true,
  thumbnail: true,
  releasedAt: true,
} as const;

const ADMIN_POST_LIST_SELECT = {
  ...POST_LIST_SELECT,
  isTemp: true,
  isMain: true,
  mainOrder: true,
} as const;

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  findMain(): Promise<Post[]> {
    return this.repository.find({
      select: {
        ...POST_LIST_SELECT,
        mainOrder: true,
      },
      where: { isMain: true, isTemp: false },
      order: { mainOrder: 'ASC' },
    });
  }

  findPublishedPage(page: number, limit: number): Promise<Post[]> {
    return this.repository.find({
      select: POST_LIST_SELECT,
      where: { isTemp: false },
      order: { releasedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit + 1,
    });
  }

  findAllAdminPaginated(
    page: number,
    limit: number,
    options?: { isTemp?: boolean; isDeleted?: boolean },
  ): Promise<[Post[], number]> {
    const where: FindOptionsWhere<Post> = {};

    if (options?.isTemp !== undefined) where.isTemp = options.isTemp;

    if (options?.isDeleted) {
      where.deletedAt = Not(IsNull());
    }

    return this.repository.findAndCount({
      select: ADMIN_POST_LIST_SELECT,
      where,
      withDeleted: options?.isDeleted === true,
      order: { releasedAt: 'DESC', id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findById(id: number): Promise<Post | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByIdWithDeleted(id: number): Promise<Post | null> {
    return this.repository.findOne({ where: { id }, withDeleted: true });
  }

  findByUrlSlug(urlSlug: string): Promise<Post | null> {
    return this.repository.findOne({ where: { urlSlug } });
  }

  create(data: Partial<Post>): Promise<Post> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async updateById(id: number, data: Partial<Post>): Promise<Post | null> {
    await this.repository.update({ id }, data);
    return this.findById(id);
  }

  async softDeleteById(id: number): Promise<void> {
    const post = await this.repository.findOne({ where: { id } });
    if (!post) return;

    await this.repository.update(
      { id },
      {
        urlSlug: `${post.urlSlug}__deleted__${id}`,
        isMain: false,
        mainOrder: null,
      },
    );

    await this.repository.softDelete(id);
  }

  async recoverById(id: number): Promise<void> {
    await this.repository.recover({ id });
  }

  findPublishedBySlug(slug: string): Promise<Post | null> {
    return this.repository.findOne({
      where: { urlSlug: slug, isTemp: false },
      relations: { series: true },
    });
  }
}
