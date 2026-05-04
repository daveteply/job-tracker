import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase, RxStorage } from 'rxdb';
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import {
  CompanySchema,
  ContactSchema,
  EventSchema,
  EventTypeSchema,
  ReminderSchema,
  RoleSchema,
} from '@job-tracker/domain';

import { CompanyDocument } from './documents/company.document';
import { ContactDocument } from './documents/contact.document';
import { EventDocument } from './documents/event.document';
import { EventTypeDocument } from './documents/event-type.document';
import { ReminderDocument } from './documents/reminder.document';
import { RoleDocument } from './documents/role.document';
import { seedEventTypes } from './seed-data';

// Add plugins
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBJsonDumpPlugin);

// Add dev mode in development
if (process.env['NODE_ENV'] === 'development') {
  disableWarnings();
  addRxPlugin(RxDBDevModePlugin);
}

// Singleton storage to ensure we always use the exact same storage instance.
// This is critical because RxDB's ignoreDuplicate check fails if the storage object is different.
let storageInstance: RxStorage<any, any> | undefined;

export function getStorage(): RxStorage<any, any> {
  if (!storageInstance) {
    const isDev = process.env.NODE_ENV === 'development';
    const baseStorage = getRxStorageDexie();

    if (!baseStorage) {
      throw new Error('[DB] Critical: getRxStorageDexie() returned undefined.');
    }

    if (isDev && typeof wrappedValidateAjvStorage === 'function') {
      try {
        storageInstance = wrappedValidateAjvStorage({ storage: baseStorage });
      } catch (e) {
        console.error('[DB] Failed to wrap storage with AJV:', e);
        storageInstance = baseStorage;
      }
    } else {
      storageInstance = baseStorage;
    }
  }
  return storageInstance!;
}

// Cache for database promises to handle concurrent calls for the same database name.
const dbPromises = new Map<string, Promise<TrackerDatabase>>();

export type CompanyCollection = RxCollection<CompanyDocument>;
export type ContactCollection = RxCollection<ContactDocument>;
export type RoleCollection = RxCollection<RoleDocument>;
export type EventCollection = RxCollection<EventDocument>;
export type EventTypeCollection = RxCollection<EventTypeDocument>;
export type ReminderCollection = RxCollection<ReminderDocument>;

export interface TrackerCollections {
  companies: CompanyCollection;
  contacts: ContactCollection;
  roles: RoleCollection;
  events: EventCollection;
  eventTypes: EventTypeCollection;
  reminders: ReminderCollection;
}

export type TrackerDatabase = RxDatabase<TrackerCollections>;

/**
 * Initializes a new RxDatabase instance with all collections.
 * Uses a promise cache and singleton storage to prevent DB9 errors.
 */
export async function initRxDatabase(name: string): Promise<TrackerDatabase> {
  const existingPromise = dbPromises.get(name);
  if (existingPromise) {
    return existingPromise;
  }

  const initPromise = (async () => {
    try {
      const storage = getStorage();

      const db = await createRxDatabase<TrackerCollections>({
        name,
        storage,
        ignoreDuplicate: true,
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
        });
      }

      // Seed data if needed
      const eventTypeCount = await db.eventTypes.count().exec();
      if (eventTypeCount === 0) {
        await db.eventTypes.bulkInsert(seedEventTypes);
      }

      // If the database is closed, remove it from the cache
      db.onClose.push(() => {
        dbPromises.delete(name);
      });

      return db;
    } catch (err) {
      // Clear the promise from the cache on failure so it can be retried
      dbPromises.delete(name);
      throw err;
    }
  })();

  dbPromises.set(name, initPromise);
  return initPromise;
}
