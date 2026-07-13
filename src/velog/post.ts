import { VelogClient } from '@/velog/client';

export interface VelogPostSeries {
    url_slug: string;
}

export interface VelogPost {
    id: string; 
    title: string;
    url_slug: string;
    released_at: string;
    body: string;
    short_description: string | null;
    thumbnail: string | null;
    tags: string[]; 
    is_temp: boolean;
    series: VelogPostSeries | null;
}

const POST_BODY_QUERY = `
  query Post($username: String!, $url_slug: String!) {
    post(username: $username, url_slug: $url_slug) {
      body
    }
  }
`;

const POSTS_LIST_QUERY = `
  query Posts($username: String!, $cursor: ID) {
    posts(username: $username, cursor: $cursor) {
      id
      title
      url_slug
      released_at
      short_description
      thumbnail
      tags
      is_temp
      series {
        url_slug
      }
    }
  }
`;

async function fetchPostBody(
  client: VelogClient,
  username: string,
  urlSlug: string,
): Promise<string> {
  const result = await client.request<{ data: { post: { body: string } | null } }>(
    POST_BODY_QUERY,
    { username, url_slug: urlSlug },
  );

  const body = result.data.post?.body;
  
  if (!body) {
    throw new Error(`[fetch-posts] body not found: ${urlSlug}`);
  }

  return body;
}

export async function fetchPosts(username: string): Promise<VelogPost[]> {
    const client = new VelogClient();
    const result: VelogPost[] = [];
    const seen = new Set<string>();
    let cursor: string | undefined;

    while (true) {
        const response = await client.request<{
        data: { posts: Omit<VelogPost, 'body'>[] };
    }>(POSTS_LIST_QUERY, { username, cursor });
    
    const posts = response.data.posts ?? [];
    
    if (posts.length === 0) break;

    console.log(`[fetch-posts] cursor=${cursor ?? 'start'}, got=${posts.length}`);

    let added = 0;
    
    for (const post of posts) {
      if (seen.has(post.id)) return result;
      if (post.is_temp) continue;

      seen.add(post.id);

      const body = await fetchPostBody(client, username, post.url_slug);
      result.push({ ...post, body });
      added++;

      console.log(`[fetch-posts] body loaded: ${post.url_slug}`);
    }

    if (added === 0) break;
    cursor = posts[posts.length - 1].id;
  }

  return result;
}
