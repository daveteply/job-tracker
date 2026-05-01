import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase } from 'rxdb';
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

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

// Temporarily enable dev mode in production to debug DB9 error
// We will remove this once the issue is resolved.
disableWarnings();
addRxPlugin(RxDBDevModePlugin);

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
 */
export async function initRxDatabase(name: string): Promise<TrackerDatabase> {
  console.log(`[DB] initRxDatabase start: ${name}`);
  console.log(`[DB] NODE_ENV: ${process.env['NODE_ENV']}`);
  console.log(`[DB] getRxStorageDexie type: ${typeof getRxStorageDexie}`);

  const storage = getRxStorageDexie();
  console.log(`[DB] storage object:`, storage);

  if (!storage) {
    console.error('[DB] CRITICAL: storage is undefined');
    throw new Error('RxDB Storage engine is undefined');
  }

  const db = await createRxDatabase<TrackerCollections>({
    name,
    storage,
    ignoreDuplicate: true,
  });

  await db.addCollections({
    companies: { schema: CompanySchema },
    contacts: { schema: ContactSchema },
    roles: { schema: RoleSchema },
    events: { schema: EventSchema },
    eventTypes: { schema: EventTypeSchema },
    reminders: { schema: ReminderSchema },
  });

  // Seed data if needed
  const eventTypeCount = await db.eventTypes.count().exec();
  if (eventTypeCount === 0) {
    await db.eventTypes.bulkInsert(seedEventTypes);
  }

  return db;
}
