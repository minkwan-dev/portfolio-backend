import { VelogPost } from "@/velog/post";
import { EntityManager } from "typeorm";
import { Tag } from '@/modules/blog/entities/tag.entity';

export function extractTags(posts: VelogPost[]): string[] {
    const set = new Set<string>();

    for (const post of posts) {
        for (const name of post.tags ?? []) {
            set.add(name);
        }
    }

    return [...set];
}

export async function upsertTag(manager: EntityManager, name: string): Promise<Tag> {
    const repo = manager.getRepository(Tag);
    const existing = await repo.findOne({ where: { name } });

    if (existing) return existing;

    return repo.save(repo.create({ name }));
}

export async function importTags(manager: EntityManager, posts: VelogPost[]): Promise<void> {
    for (const name of extractTags(posts)) {
        const saved = await upsertTag(manager, name);
        console.log(`[import-tags] saved: ${saved.name} (id=${saved.id})`);
    }    
}