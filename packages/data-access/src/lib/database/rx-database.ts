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

// Truly global state using globalThis to handle module re-evaluation
const _global = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : global) as any;

// Add plugins only once
if (!_global.__rxdb_plugins_added) {
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBJsonDumpPlugin);

  // Add dev mode in development
  if (process.env['NODE_ENV'] === 'development') {
    disableWarnings();
    addRxPlugin(RxDBDevModePlugin);
  }
  _global.__rxdb_plugins_added = true;
}

export function getStorage(): RxStorage<any, any> {
  if (!_global.__rxdb_storage) {
    const isDev = process.env.NODE_ENV === 'development';
    const baseStorage = getRxStorageDexie();

    if (!baseStorage) {
      throw new Error('[DB] Critical: getRxStorageDexie() returned undefined.');
    }

    if (isDev && typeof wrappedValidateAjvStorage === 'function') {
      try {
        _global.__rxdb_storage = wrappedValidateAjvStorage({ storage: baseStorage });
      } catch (e) {
        console.error('[DB] Failed to wrap storage with AJV:', e);
        _global.__rxdb_storage = baseStorage;
      }
    } else {
      _global.__rxdb_storage = baseStorage;
    }
  }
  return _global.__rxdb_storage;
}

// Cache for database promises
if (!_global.__rxdb_promises) {
  _global.__rxdb_promises = new Map<string, Promise<TrackerDatabase>>();
}
const dbPromises: Map<string, Promise<TrackerDatabase>> = _global.__rxdb_promises;

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
 * Uses a global promise cache and singleton storage to prevent DB9 errors.
 */
export async function initRxDatabase(name: string): Promise<TrackerDatabase> {
  const existingPromise = dbPromises.get(name);
  if (existingPromise) {
    try {
      const db = await existingPromise;
      if (!db.closed) {
        return existingPromise;
      }
      // If it's closed, remove it from cache and proceed to create a new one
      dbPromises.delete(name);
    } catch (e) {
      // If the existing promise failed, remove it so we can retry
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
