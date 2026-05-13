import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase, RxStorage } from 'rxdb';
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import {
  CompanySchema,
  ContactSchema,
  EventSchema,
  EventTypeSchema,
  ReminderSchema,
  RoleSchema,
  UserSettingsSchema,
} from '@job-tracker/domain';

import { CompanyDocument } from './documents/company.document';
import { ContactDocument } from './documents/contact.document';
import { EventDocument } from './documents/event.document';
import { EventTypeDocument } from './documents/event-type.document';
import { ReminderDocument } from './documents/reminder.document';
import { RoleDocument } from './documents/role.document';
import { UserSettingsDocument } from './documents/user-settings.document';
import { seedEventTypes } from './seed-data';

interface GlobalRxDB {
  __rxdb_plugins_added?: boolean;
  __rxdb_storage?: RxStorage<unknown, unknown>;
  __rxdb_promises?: Map<string, Promise<TrackerDatabase>>;
}

const _global = (typeof window !== 'undefined' ? window : global) as unknown as GlobalRxDB;

// Add plugins only once
if (!_global.__rxdb_plugins_added) {
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBMigrationSchemaPlugin);
  addRxPlugin(RxDBJsonDumpPlugin);

  // Add dev mode in development
  if (process.env['NODE_ENV'] === 'development') {
    disableWarnings();
    addRxPlugin(RxDBDevModePlugin);
  } else {
    // In production, we silence the RxDB Open Core nag message.
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const firstArg = args[0];
      if (typeof firstArg === 'string' && firstArg.includes('RxDB Open Core RxStorage')) {
        return;
      }
      originalConsoleWarn.apply(console, args);
    };
  }
  _global.__rxdb_plugins_added = true;
}

export function getStorage(): RxStorage<unknown, unknown> {
  if (!_global.__rxdb_storage) {
    const baseStorage = getRxStorageDexie();
    if (!baseStorage) {
      throw new Error('[DB] Critical: getRxStorageDexie() returned undefined.');
    }

    if (process.env['NODE_ENV'] === 'development') {
      try {
        _global.__rxdb_storage = wrappedValidateAjvStorage({ storage: baseStorage }) as RxStorage<unknown, unknown>;
      } catch {
        console.error('[DB] Failed to wrap storage with AJV validation');
        _global.__rxdb_storage = baseStorage as RxStorage<unknown, unknown>;
      }
    } else {
      _global.__rxdb_storage = baseStorage as RxStorage<unknown, unknown>;
    }
  }
  return _global.__rxdb_storage;
}

if (!_global.__rxdb_promises) {
  _global.__rxdb_promises = new Map<string, Promise<TrackerDatabase>>();
}
const dbPromises: Map<string, Promise<TrackerDatabase>> = _global.__rxdb_promises;

export type UserSettingsCollection = RxCollection<UserSettingsDocument>;

export interface TrackerCollections {
  companies: RxCollection<CompanyDocument>;
  contacts: RxCollection<ContactDocument>;
  roles: RxCollection<RoleDocument>;
  events: RxCollection<EventDocument>;
  eventTypes: RxCollection<EventTypeDocument>;
  reminders: RxCollection<ReminderDocument>;
  userSettings: UserSettingsCollection;
}

export type TrackerDatabase = RxDatabase<TrackerCollections>;

/**
 * Gets or creates an RxDatabase instance for the given name.
 * Uses a promise cache to ensure only one instance is created per name.
 */
export async function initRxDatabase(name: string): Promise<TrackerDatabase> {
  const existingPromise = dbPromises.get(name);
  if (existingPromise) {
    try {
      const db = await existingPromise;
      if (!db.closed) {
        return db;
      }
      dbPromises.delete(name);
    } catch (err) {
      dbPromises.delete(name);
    }
  }

  const promiseHolder: { p: Promise<TrackerDatabase> | null } = { p: null };
  const initPromise = (async () => {
    try {
      const storage = getStorage();

      const db = await createRxDatabase<TrackerCollections>({
        name,
        storage,
        ignoreDuplicate: process.env.NODE_ENV === 'development',
      });

      // If collections are already added, addCollections will throw.
      // We check if companies exists as a proxy for all collections.
      if (!db.companies) {
        await db.addCollections({
          companies: { schema: CompanySchema },
          contacts: { schema: ContactSchema },
          roles: { schema: RoleSchema },
          events: { schema: EventSchema },
          eventTypes: { schema: EventTypeSchema },
          reminders: { schema: ReminderSchema },
          userSettings: {
            schema: UserSettingsSchema,
            migrationStrategies: {
              // 1: Add locale field
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Migration docs represent historical data and can have any shape.
              1: (oldDoc: any) => {
                oldDoc.locale = 'en-US';
                return oldDoc;
              },
              // 2: Add appearance field
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Migration docs represent historical data and can have any shape.
              2: (oldDoc: any) => {
                oldDoc.appearance = 'system';
                return oldDoc;
              },
            },
          },
        });
      }


      // Seed data if needed
      const eventTypeCount = await db.eventTypes.count().exec();
      if (eventTypeCount === 0) {
        await db.eventTypes.bulkInsert(seedEventTypes);
      }

      const settingsCount = await db.userSettings.count().exec();
      if (settingsCount === 0) {
        const now = new Date().toISOString();
        await db.userSettings.insert({
          id: 'current',
          showFullEventList: false,
          showInactiveRoles: false,
          locale: 'en-US',
          appearance: 'system',
          createdAt: now,
          updatedAt: now,
        });
      }

      // If the database is closed, remove it from the cache
      db.onClose.push(() => {
        if (dbPromises.get(name) === promiseHolder.p) {
          dbPromises.delete(name);
        }
      });

      return db;
    } catch (err) {
      // Clear the promise from the cache on failure so it can be retried
      if (dbPromises.get(name) === promiseHolder.p) {
        dbPromises.delete(name);
      }
      throw err;
    }
  })();

  promiseHolder.p = initPromise;
  dbPromises.set(name, initPromise);
  return initPromise;
}
