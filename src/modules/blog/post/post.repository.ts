import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from '@/modules/blog/entities/post.entity';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(Post)
        private readonly repository: Repository<Post>,
    ) {}

    findMain(): Promise<Post[]> {
        return this.repository.find({
            where: { isMain: true, isTemp: false},
            order: { mainOrder: 'ASC' },
        })
    }

    findAllPublished(): Promise<Post[]> {
        return this.repository.find({
            where: { isTemp: false },
            order: { releasedAt: 'DESC' },
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