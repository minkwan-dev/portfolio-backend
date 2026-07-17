import { EntityManager } from "typeorm";
import { upsertTag } from '@/velog/tag';
import { Post } from '@/modules/blog/entities/post.entity';
import { PostTag } from '@/modules/blog/entities/post-tag.entity';

export async function syncPostTags(manager: EntityManager, post: Post, tagNames: string[]): Promise<void> {
    const repo = manager.getRepository(PostTag);
    await repo.delete({ postId: post.id });

    for (const name of tagNames) {
        const tag = await upsertTag(manager, name);
        await repo.save(repo.create({ postId: post.id, tagId: tag.id }));
    }

    console.log(`[sync-post-tags] post=${post.urlSlug} tags=[${tagNames.join(', ')}]`);
}