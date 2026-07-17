import { DataSource } from 'typeorm';
import { fetchPosts, upsertPost } from '@/velog/post';
import { syncPostTags } from '@/velog/post-tag';
import { importSeries } from '@/velog/series';
import { Series } from '@/modules/blog/entities/series.entity';

export async function runImport(dataSource: DataSource, username: string): Promise<void> {
    const posts = await fetchPosts(username);
    const seriesOrderMap = new Map<number, number>();

    console.log(`[run] posts fetched: ${posts.length}`);

    await dataSource.transaction((manager) => importSeries(manager, username));

    for (const item of posts) {
        await dataSource.transaction(async (manager) => {
            let seriesOrder: number | null = null;

            if (item.series) {
                const series = await manager.getRepository(Series).findOne({
                    where: { urlSlug: item.series.url_slug },
                })

                if (series) {
                    const next = (seriesOrderMap.get(series.id) ?? 0) + 1;
                    seriesOrderMap.set(series.id, next);
                    seriesOrder = next;
                }
            };

            const post = await upsertPost(manager, item, seriesOrder);

            await syncPostTags(manager, post, item.tags ?? []);
        })

        console.log(`[run] imported: ${item.url_slug}`);
    }
}