import { fetchPosts } from "@/velog/post";
import { extractTags } from '@/velog/tag';

const username = process.env.VELOG_USERNAME ?? 'minkwan';

fetchPosts(username)
    .then((posts) => {
        const tags = extractTags(posts);
        console.log(`[extract-tags] count: ${tags.length}`);
        console.log('[extract-tags] sample:', tags.slice(0, 10));
    })
    .catch((error) => console.error('[extract-tags] FAIL', error));