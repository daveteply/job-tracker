'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useSession } from 'next-auth/react';

import { GUEST_DB_NAME, promoteGuestToUser } from './promotion';
import { SyncStatus, useReplication } from './replication';
import { initRxDatabase, TrackerDatabase } from './rx-database';

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
    const dbName = userId ? `job_tracker_db_${userId}` : prevDbName || GUEST_DB_NAME;

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

  return <DatabaseContext.Provider value={{ db, syncStatus }}>{children}</DatabaseContext.Provider>;
};

export const DatabaseGate = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
  const db = useDb();
  if (!db) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

export const useDb = () => {
  const context = useContext(DatabaseContext);
  return context.db;
};

export const useSyncStatus = () => {
  const context = useContext(DatabaseContext);
  return context.syncStatus;
};

export type { SyncStatus } from './replication';
export type { TrackerCollections, TrackerDatabase } from './rx-database';
