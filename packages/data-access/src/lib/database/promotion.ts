import { removeRxDatabase, RxCollection } from 'rxdb';

import {
  getStorage,
  initRxDatabase,
  TrackerCollections,
  TrackerDatabase,
} from './rx-database';

export const GUEST_DB_NAME = 'job_tracker_db_guest';

/**
 * Promotes data from the guest database to the newly initialized user database.
 */
export async function promoteGuestToUser(targetDb: TrackerDatabase): Promise<void> {
  let guestDb: TrackerDatabase | null = null;

  try {
    // 1. Open guest database temporarily
    guestDb = await initRxDatabase(GUEST_DB_NAME);

    // 2. Export and Import each collection (except eventTypes)
    const collectionsToPromote = Object.keys(guestDb.collections).filter(
      (name) => name !== 'eventTypes',
    ) as Array<keyof TrackerCollections>;

    for (const colName of collectionsToPromote) {
      const collection = guestDb.collections[colName];
      const count = await collection.count().exec();

      if (count > 0) {
        const json = await collection.exportJSON();
        // Cast to unknown collection to avoid union mismatch while avoiding 'any'
        const targetCollection = targetDb.collections[colName] as RxCollection<unknown>;
        await targetCollection.importJSON(json);
      }
    }

    // 3. Close and cleanup guest database
    await guestDb.close();
    guestDb = null;

    await removeRxDatabase(GUEST_DB_NAME, getStorage());
  } catch (err) {
    console.error('[Promotion] CRITICAL ERROR during promotion:', err);
    if (guestDb) {
      await guestDb.close().catch((closeError) => {
        console.warn('[Promotion] Failed to close guest database during cleanup', closeError);
      });
    }
  }
}
