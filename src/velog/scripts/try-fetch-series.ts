import { fetchSeries } from "@/velog/series";

const username = process.env.VELOG_USERNAME ?? 'minkwan';

fetchSeries(username)
    .then((items) => {
        console.log(`[fetch-series] count: ${items.length}`);
        console.log('[fetch-series] first:', items[0]);
    })
    .catch((error) => console.error('[fetch-series] FAIL', error));