import { fetchPosts } from '@/import/velog/post';

const username = process.env.VELOG_USERNAME ?? 'minkwan';

fetchPosts(username)
    .then((posts) => {
        const first = posts[0];

        console.log(`[fetch-posts] total: ${posts.length}`);
        console.log('[fetch-posts] first:', {
            title: first?.title,
            url_slug: first?.url_slug,
            is_temp: first?.is_temp,
            bodyLength: first?.body.length,
            tags: first?.tags,
            series: first?.series?.url_slug ?? null,
        });
    })
    .catch((error) => console.error('[fetch-posts] FAIL', error));