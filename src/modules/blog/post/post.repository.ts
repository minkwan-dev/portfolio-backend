import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from '@/modules/blog/entities/post.entity';

const POST_LIST_SELECT = {
    id: true,
    title: true,
    urlSlug: true,
    thumbnail: true,
    releasedAt: true,
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