import { map, Observable } from 'rxjs';

import { upsertEntity } from '@job-tracker/app-logic';
import { createAuditTimestamps, createUpdatedAt } from '@job-tracker/app-logic';
import { EventDTO } from '@job-tracker/validation';

import { TrackerDatabase } from '../database/db';
import { EventMapper } from '../mappers/event.mapper';

export class EventRepository {
  constructor(private readonly db: TrackerDatabase) {}

  list$(): Observable<EventDTO[]> {
    return this.db.events
      .find({
        sort: [{ occurredAt: 'desc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => EventMapper.toDto(doc.toJSON()))));
  }

  listRecentEventTypeIds$(limit = 10): Observable<string[]> {
    return this.db.events
      .find({
        sort: [{ updatedAt: 'desc' }],
        limit: 50, // Get a reasonable number to extract unique IDs from
      })
      .$.pipe(
        map((docs) => {
          const ids = docs.map((doc) => doc.eventTypeId).filter((id): id is string => !!id);
          return Array.from(new Set(ids)).slice(0, limit);
        }),
      );
  }

  // Backward-compatible alias while consumers move to list$ naming.
  getAll$(): Observable<EventDTO[]> {
    return this.list$();
  }

  async getById(id: string): Promise<EventDTO | null> {
    const doc = await this.db.events.findOne(id).exec();
    if (!doc) return null;

    return EventMapper.toDto(doc.toJSON());
  }

  async create(event: Partial<EventDTO> & { id: string }): Promise<EventDTO> {
    const timestamps = createAuditTimestamps();
    const doc = EventMapper.toDocument({
      ...(event as Parameters<typeof EventMapper.toDocument>[0]),
      ...timestamps,
    });

    const inserted = await this.db.events.insert(doc);
    return EventMapper.toDto(inserted.toJSON());
  }

  async update(id: string, event: Partial<EventDTO>): Promise<EventDTO | null> {
    const existing = await this.db.events.findOne(id).exec();
    if (!existing) return null;

    const existingDoc = existing.toJSON();
    const merged = EventMapper.toDocument({
      ...existingDoc,
      ...(event as Parameters<typeof EventMapper.toDocument>[0]),
      id,
      updatedAt: createUpdatedAt(),
      createdAt: existingDoc.createdAt,
    });

    const updated = await this.db.events.upsert(merged);
    return EventMapper.toDto(updated.toJSON());
  }

  async upsert(event: Partial<EventDTO> & { id: string }): Promise<EventDTO> {
    return upsertEntity(event, {
      entityName: 'event',
      create: (input) => this.create(input),
      update: (id, input) => this.update(id, input),
      findExisting: (id) => this.db.events.findOne(id).exec(),
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const doc = await this.db.events.findOne(id).exec();
    if (doc) {
      await doc.remove();
      return true;
    }
    return false;
  }

  // Backward-compatible alias while consumers move to deleteById naming.
  async remove(id: string): Promise<void> {
    await this.deleteById(id);
  }
}
