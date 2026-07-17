import dataSource from "@/modules/database/data-source";
import { fetchPosts } from '@/velog/post';
import { importTags } from '@/velog/tag';

async function main() {
    const posts = await fetchPosts(process.env.VELOG_USERNAME ?? 'minkwan');

    await dataSource.initialize();
    await dataSource.transaction((manager) => importTags(manager, posts));
    await dataSource.destroy();

    console.log('[import-tags] done');
}

main().catch(console.error);