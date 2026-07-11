import { VelogClient } from "@/import/velog/client";

export interface VelogSeries {
    id: string;
    name: string;
    url_slug: string;
    description: string | null;
    thumbnail: string | null;
}

const SERIES_QUERY = `
  query SeriesList($username: String!) {
    seriesList(username: $username) {
      id
      name
      url_slug
      description
      thumbnail
    }
  }
`;

export async function fetchSeries(username: string): Promise<VelogSeries[]> {
    const client = new VelogClient();

    const result = await client.request<{ data: { seriesList: VelogSeries[] } }>(
        SERIES_QUERY,
        { username },
    )

    return result.data.seriesList ?? [];
}