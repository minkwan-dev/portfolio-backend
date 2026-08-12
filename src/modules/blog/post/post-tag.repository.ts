import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostTag } from "../entities";
import { EntityManager, In, Repository } from "typeorm";

@Injectable()
export class PostTagRepository {
    constructor(
        @InjectRepository(PostTag)
        private readonly repository: Repository<PostTag>,
    ) {}

    async findTagNamesByPostIds(postIds: number[]): Promise<Map<number, string[]>> {
        if (postIds.length === 0) return new Map();

        // [1, 99] [1, 67], [2, 78]
        const links = await this.repository.find({
            where: { postId: In(postIds) },
            relations: { tag: true },
        })

        const map = new Map<number, string[]>();

        for (const link of links) {
            const names = map.get(link.postId) ?? [];
            names.push(link.tag.name);
            map.set(link.postId, names);
        }

        return map;
    }

    async replaceForPost(
        postId: number,
        tagIds: number[],
        manager?: EntityManager,
    ): Promise<void> {
        const repo = manager ? manager.getRepository(PostTag) : this.repository;

        await repo.delete({ postId });

        if (tagIds.length === 0) return;

        await repo.save(
            tagIds.map((tagId) => ({ postId, tagId })),
        );
    }
}