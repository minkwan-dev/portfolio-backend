import { VelogClient } from "@/velog/client";
import { Series } from "@/modules/blog/entities/series.entity";
import { EntityManager } from "typeorm";

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

export async function upsertSeries(manager: EntityManager, item: VelogSeries): Promise<Series> {
    const repo = manager.getRepository(Series);

    const payload = {
        name: item.name,
        urlSlug: item.url_slug,
        description: item.description,
        thumbnail: item.thumbnail,
    };

    await repo.upsert(payload, ['urlSlug']);

    return repo.findOneOrFail({ where: { urlSlug: payload.urlSlug } });
}

export async function importSeries(manager: EntityManager, username: string): Promise<void> {
    const items = await fetchSeries(username);

    for (const item of items) {
        const saved = await upsertSeries(manager, item);
        console.log(`[import-series] saved: ${saved.urlSlug} (id=${saved.id})`);
    }
}