import dataSource from '@/modules/database/data-source';
import { fetchPosts, upsertPost } from '@/velog/post';
import { syncPostTags } from '@/velog/post-tag';
import { importSeries } from '@/velog/series';

async function main() {
    const username = process.env.VELOG_USERNAME ?? 'minkwan';
    const posts = await fetchPosts(username);
    const target = posts[0];

    if (!target) {
        console.log('[sync-post-tags] no posts');
        return;
    }

    await dataSource.initialize();
    
    await dataSource.transaction(async (manager) => {
        await importSeries(manager, username);
        const post = await upsertPost(manager, target, target.series ? 1 : null);
        await syncPostTags(manager, post, target.tags ?? []);
    })

    await dataSource.destroy();

    console.log('[sync-post-tags] done');
}

main().catch(console.error);