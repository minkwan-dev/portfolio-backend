import dataSource from "@/modules/database/data-source";
import { importSeries } from "@/velog/series";

async function main() {
    const username = process.env.VELOG_USERNAME ?? 'minkwan';

    await dataSource.initialize();

    await dataSource.transaction((manager) => importSeries(manager, username));

    await dataSource.destroy();

    console.log('[import-series] done');
}

main().catch(console.error);