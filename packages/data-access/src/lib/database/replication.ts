import { useEffect, useState } from 'react';

import {
  ReplicationPullHandlerResult,
  ReplicationPushHandlerResult,
} from 'rxdb';
import {
  replicateRxCollection,
  RxReplicationState,
} from 'rxdb/plugins/replication';

import { TrackerDatabase } from './rx-database';

const SYNC_URL = process.env['NEXT_PUBLIC_SYNC_URL'] || 'http://localhost:8080/sync';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline';

export interface Checkpoint {
  serverTimestamp: number;
  id: string;
}

export function useReplication(db: TrackerDatabase | null, userId: string | undefined) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');

  useEffect(() => {
    if (!db || !userId) {
      setSyncStatus('offline');
      return;
    }

    const replicationStates: RxReplicationState<unknown, Checkpoint>[] = [];

    const startReplication = () => {
      Object.values(db.collections).forEach((collection) => {
        // Don't sync eventTypes as they are seeded and fixed
        if (collection.name === 'eventTypes') return;

        const replicationState = replicateRxCollection<unknown, Checkpoint>({
          collection,
          replicationIdentifier: `sync-${collection.name}`,
          live: true,
          retryTime: 5000,
          pull: {
            handler: async (lastCheckpoint, batchSize) => {
              try {
                const response = await fetch(`${SYNC_URL}/pull`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': userId,
                  },
                  body: JSON.stringify({
                    collection: collection.name,
                    checkpoint: lastCheckpoint,
                    limit: batchSize,
                  }),
                });
                return (await response.json()) as ReplicationPullHandlerResult<
                  unknown,
                  Checkpoint
                >;
              } catch (err) {
                setSyncStatus('offline');
                throw err;
              }
            },
          },
          push: {
            handler: async (rows) => {
              try {
                const response = await fetch(`${SYNC_URL}/push?collection=${collection.name}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': userId,
                  },
                  body: JSON.stringify(rows),
                });
                // The push handler expects an array of documents that had conflicts or were deleted.
                // Our backend currently returns the rows it processed.
                return (await response.json()) as ReplicationPushHandlerResult<{ _deleted: boolean }>;
              } catch (err) {
                setSyncStatus('offline');
                throw err;
              }
            },
          },
        });

        replicationStates.push(replicationState);

        // Update sync status based on replication state
        replicationState.active$.subscribe((active) => {
          if (active) setSyncStatus('syncing');
          else setSyncStatus('synced');
        });

        replicationState.error$.subscribe((err) => {
          console.error(`Replication error in ${collection.name}:`, err);
          setSyncStatus('error');
        });
      });
    };

    startReplication();

    return () => {
      replicationStates.forEach((state) => state.cancel());
    };
  }, [db, userId]);

  return syncStatus;
}
