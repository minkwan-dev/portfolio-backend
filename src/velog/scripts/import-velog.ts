import dataSource from '@/modules/database/data-source';
import { runImport } from '@/velog/run';

async function main() {
    const username = process.env.VELOG_USERNAME ?? 'minkwan';

    await dataSource.initialize();
    await runImport(dataSource, username);
    await dataSource.destroy();
  
    console.log('[import-velog] 완료');
}

main().catch(async (error) => {
    console.error(error);
    if (dataSource.isInitialized) await dataSource.destroy();
    process.exit(1);
});