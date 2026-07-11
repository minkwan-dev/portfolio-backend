import { VelogClient } from '@/import/velog/client';

const client = new VelogClient();
const username = process.env.VELOG_USERNAME ?? 'minkwan';

client
  .request<{ data: { seriesList: { id: string; name: string }[] } }>(
    `query { seriesList(username: "minkwan") { id name } }`,
    { username }
  )
  .then((result) => {
    console.log('[client] OK');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => console.error('[client] FAIL', error));