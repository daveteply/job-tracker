'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase } from 'rxdb';
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import {
  EventSchema,
  EventTypeSchema,
  RoleSchema,
  ReminderSchema,
  CompanySchema,
  ContactSchema,
} from '@job-tracker/domain';
import { CompanyDocument } from './documents/company.document';
import { ContactDocument } from './documents/contact.document';
import { RoleDocument } from './documents/role.document';
import { EventDocument } from './documents/event.document';
import { EventTypeDocument } from './documents/event-type.document';
import { ReminderDocument } from './documents/reminder.document';
import { seedEventTypes } from './seed-data';

// Add dev mode in development
if (process.env['NODE_ENV'] === 'development') {
  disableWarnings();
  addRxPlugin(RxDBDevModePlugin);
}

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

const DatabaseContext = createContext<TrackerDatabase | null>(null);

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [db, setDb] = useState<TrackerDatabase | null>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    // Ensure this only runs in the browser and hasn't been initialized
    if (typeof window === 'undefined' || db || isInitializing.current) {
      return;
    }

    isInitializing.current = true;

    const initDB = async () => {
      try {
        const _db = await createRxDatabase<TrackerCollections>({
          name: 'job_tracker_db',
          storage: wrappedValidateAjvStorage({
            storage: getRxStorageDexie(),
          }),
          ignoreDuplicate: true, // Useful for Hot Module Replacement in monorepos
        });

        await _db.addCollections({
          companies: { schema: CompanySchema },
          contacts: { schema: ContactSchema },
          roles: { schema: RoleSchema },
          events: { schema: EventSchema },
          eventTypes: { schema: EventTypeSchema },
          reminders: { schema: ReminderSchema },
        });
        setDb(_db);

        const eventTypeCount = await _db.eventTypes.count().exec();
        if (eventTypeCount === 0) {
          await _db.eventTypes.bulkInsert(seedEventTypes);
        }
      } catch (error) {
        console.error('Failed to initialize RxDB:', error);
        isInitializing.current = false;
      }
    };
    initDB();
  }, [db]);

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

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
};

export const useDb = () => {
  const context = useContext(DatabaseContext);
  return context;
};
