import { EventTypeDTO } from '@job-tracker/validation';
import { TrackerDatabase } from '../database/db';
import { map, Observable } from 'rxjs';
import { DEFAULT_SEARCH_LIMIT, normalizeSearchInput, upsertEntity } from '@job-tracker/app-logic';
import { createAuditTimestamps, createUpdatedAt } from '@job-tracker/app-logic';
import { EventTypeMapper } from '../mappers/event-type.mapper';

export class EventTypeRepository {
  constructor(private readonly db: TrackerDatabase) {}

  list$(): Observable<EventTypeDTO[]> {
    return this.db.eventTypes
      .find({
        sort: [{ name: 'asc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => EventTypeMapper.toDto(doc.toJSON()))));
  }

  // Backward-compatible alias while consumers move to list$ naming.
  getAll$(): Observable<EventTypeDTO[]> {
    return this.list$();
  }

  async getById(id: string): Promise<EventTypeDTO | null> {
    const doc = await this.db.eventTypes.findOne(id).exec();
    if (!doc) return null;

    return EventTypeMapper.toDto(doc.toJSON());
  }

  async create(eventType: Partial<EventTypeDTO> & { id: string }): Promise<EventTypeDTO> {
    const timestamps = createAuditTimestamps();
    const doc = EventTypeMapper.toDocument({
      ...(eventType as Parameters<typeof EventTypeMapper.toDocument>[0]),
      ...timestamps,
    });

    const inserted = await this.db.eventTypes.insert(doc);
    return EventTypeMapper.toDto(inserted.toJSON());
  }

  async update(id: string, eventType: Partial<EventTypeDTO>): Promise<EventTypeDTO | null> {
    const existing = await this.db.eventTypes.findOne(id).exec();
    if (!existing) return null;

    const existingDoc = existing.toJSON();
    const merged = EventTypeMapper.toDocument({
      ...existingDoc,
      ...(eventType as Parameters<typeof EventTypeMapper.toDocument>[0]),
      id,
      updatedAt: createUpdatedAt(),
      createdAt: existingDoc.createdAt,
    });

    const updated = await this.db.eventTypes.upsert(merged);
    return EventTypeMapper.toDto(updated.toJSON());
  }

  async upsert(eventType: Partial<EventTypeDTO> & { id: string }): Promise<EventTypeDTO> {
    return upsertEntity(eventType, {
      entityName: 'eventType',
      create: (input) => this.create(input),
      update: (id, input) => this.update(id, input),
      findExisting: (id) => this.db.eventTypes.findOne(id).exec(),
    });
  }

  async searchByName(query: string, limit = DEFAULT_SEARCH_LIMIT): Promise<EventTypeDTO[]> {
    const normalizedInput = normalizeSearchInput(query, limit);
    if (!normalizedInput) return [];

    const docs = await this.db.eventTypes
      .find({
        selector: {
          $or: [{ name: { $regex: normalizedInput.pattern } }],
        },
        sort: [{ lastName: 'asc' }, { firstName: 'asc' }],
        limit: normalizedInput.limit,
      })
      .exec();

    return docs.map((doc) => EventTypeMapper.toDto(doc.toJSON()));
  }

  async deleteById(id: string): Promise<boolean> {
    const doc = await this.db.eventTypes.findOne(id).exec();
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
