import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
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
        })
    }

    findAllPublishedPaginated(
        page: number,
        limit: number,
    ): Promise<[Post[], number]> {
        return this.repository.findAndCount({
            select: POST_LIST_SELECT,
            where: { isTemp: false },
            order: { releasedAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        })
    }

    findAllAdminPaginated(
        page: number,
        limit: number,
        isTemp?: boolean,
    ): Promise<[Post[], number]> {
        const where: FindOptionsWhere<Post> = {};
        if (isTemp !== undefined) where.isTemp = isTemp;

        return this.repository.findAndCount({
            select: ADMIN_POST_LIST_SELECT,
            where,
            order: { releasedAt: 'DESC', id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        })
    }

    findById(id: number): Promise<Post | null> {
        return this.repository.findOne({ where: { id } })
    }

    findByUrlSlug(urlSlug: string): Promise<Post | null> {
        return this.repository.findOne({ where: { urlSlug } })
    }

    create(data: Partial<Post>): Promise<Post> {
        const entity = this.repository.create(data)
        return this.repository.save(entity)
    }

    async updateById(id: number, data: Partial<Post>): Promise<Post | null> {
        await this.repository.update({ id }, data)
        return this.findById(id)
    }

    async deleteById(id: number): Promise<void> {
        await this.repository.delete({ id })
    }

    findPublishedBySlug(slug: string): Promise<Post | null> {
        return this.repository.findOne({
            where: { urlSlug: slug, isTemp: false },
            relations: { series: true },
        })
    }

    findPublishedById(id: number): Promise<Post | null> {
        return this.repository.findOne({
            where: { id, isTemp: false },
        })
    }
}
