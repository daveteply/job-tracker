'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { TrackerDatabase, initRxDatabase } from './rx-database';
import { promoteGuestToUser, GUEST_DB_NAME } from './promotion';
import { useReplication, SyncStatus } from './replication';

const PREV_DB_NAME_KEY = 'job_tracker_prev_db_name';

interface DatabaseContextValue {
  db: TrackerDatabase | null;
  syncStatus: SyncStatus;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  syncStatus: 'offline',
});

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [db, setDb] = useState<TrackerDatabase | null>(null);
  const isInitializing = useRef(false);

  // Use the extracted replication hook
  const syncStatus = useReplication(db, session?.user?.id);

  // Initialize DB based on auth status
  useEffect(() => {
    // Wait for session to be determined
    if (status === 'loading' || typeof window === 'undefined') {
      return;
    }

    const userId = session?.user?.id;
    const prevDbName = localStorage.getItem(PREV_DB_NAME_KEY);

    // Determine the intended database name. 
    // If logged in, use the user-specific database.
    // If logged out, default to the most recent database used on this device.
    // This allows users to continue working locally after signing out.
    const dbName = userId ? `job_tracker_db_${userId}` : (prevDbName || GUEST_DB_NAME);

    // If the database is already initialized with the correct name, do nothing
    if (db && prevDbName === dbName) {
      return;
    }

    // Prevent concurrent initializations
    if (isInitializing.current) return;
    isInitializing.current = true;

    const setupDB = async () => {
      try {
        // 1. Close previous database instance if it exists in state
        if (db) {
          await db.close();
          setDb(null);
        }

        // 2. Detect if we are transitioning from guest to user
        const isLoggingIn = userId && prevDbName === GUEST_DB_NAME;

        // 3. Initialize new database
        const _db = await initRxDatabase(dbName);

        // 4. Handle migration if logging in
        if (isLoggingIn) {
          await promoteGuestToUser(_db);
        }

        // 5. Update state and localStorage
        localStorage.setItem(PREV_DB_NAME_KEY, dbName);
        setDb(_db);
      } catch (error) {
        console.error(`[DB] Failed to setup RxDB (${dbName}):`, error);
      } finally {
        isInitializing.current = false;
      }
    };

    setupDB();
  }, [db, status, session?.user?.id]);

  if (!db) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 backdrop-blur-none z-50">
        <div>
          <span className="mr-2 capitalize">Loading Database...</span>
          <span className="loading loading-bars loading-xs text-primary"></span>
        </div>
      </div>
    );
  }

  return <DatabaseContext.Provider value={{ db, syncStatus }}>{children}</DatabaseContext.Provider>;
};

export const useDb = () => {
  const context = useContext(DatabaseContext);
  return context.db;
};

export const useSyncStatus = () => {
  const context = useContext(DatabaseContext);
  return context.syncStatus;
};

export type { TrackerDatabase, TrackerCollections } from './rx-database';
export type { SyncStatus } from './replication';
