import dataSource from '@/modules/database/data-source';
import { fetchPosts, upsertPost } from '@/velog/post';
import { importSeries } from '@/velog/series';

async function main() {
    const username = process.env.VELOG_USERNAME ?? 'minkwan';
    const posts = await fetchPosts(username);

    await dataSource.initialize();
    await dataSource.transaction(async (manager) => {
        await importSeries(manager, username);

        for (const [i, post] of posts.slice(0, 3).entries()) {
        await upsertPost(manager, post, post.series ? i + 1 : null);
        }
    });
    await dataSource.destroy();

    console.log('[import-posts] done (3 items)');
}

main().catch(console.error);