import { ReminderDTO } from '@job-tracker/validation';
import { TrackerDatabase } from '../database/db';
import { map, Observable } from 'rxjs';
import {
  createAuditTimestamps,
  createUpdatedAt,
  upsertEntity,
} from '@job-tracker/app-logic';
import { ReminderMapper } from '../mappers/reminder.mapper';

export class ReminderRepository {
  constructor(private readonly db: TrackerDatabase) {}

  list$(): Observable<ReminderDTO[]> {
    return this.db.reminders
      .find({
        sort: [{ remindAt: 'asc' }],
      })
      .$.pipe(
        map((docs) => docs.map((doc) => ReminderMapper.toDto(doc.toJSON()))),
      );
  }

  async getById(id: string): Promise<ReminderDTO | null> {
    const doc = await this.db.reminders.findOne(id).exec();
    if (!doc) return null;

    return ReminderMapper.toDto(doc.toJSON());
  }

  async getByEventId(eventId: string): Promise<ReminderDTO | null> {
    const doc = await this.db.reminders
      .findOne({
        selector: { eventId },
      })
      .exec();
    if (!doc) return null;

    return ReminderMapper.toDto(doc.toJSON());
  }

  async create(reminder: Partial<ReminderDTO> & { id: string }): Promise<ReminderDTO> {
    const timestamps = createAuditTimestamps();
    const doc = ReminderMapper.toDocument({
      ...(reminder as Parameters<typeof ReminderMapper.toDocument>[0]),
      ...timestamps,
    });

    const inserted = await this.db.reminders.insert(doc);
    return ReminderMapper.toDto(inserted.toJSON());
  }

  async update(
    id: string,
    reminder: Partial<ReminderDTO>,
  ): Promise<ReminderDTO | null> {
    const existing = await this.db.reminders.findOne(id).exec();
    if (!existing) return null;

    const existingDoc = existing.toJSON();
    const merged = ReminderMapper.toDocument({
      ...existingDoc,
      ...(reminder as Parameters<typeof ReminderMapper.toDocument>[0]),
      id,
      updatedAt: createUpdatedAt(),
      createdAt: existingDoc.createdAt,
    });

    const updated = await this.db.reminders.upsert(merged);
    return ReminderMapper.toDto(updated.toJSON());
  }

  async upsert(reminder: Partial<ReminderDTO> & { id: string }): Promise<ReminderDTO> {
    return upsertEntity(reminder, {
      entityName: 'reminder',
      create: (input) => this.create(input),
      update: (id, input) => this.update(id, input),
      findExisting: (id) => this.db.reminders.findOne(id).exec(),
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const doc = await this.db.reminders.findOne(id).exec();
    if (doc) {
      await doc.remove();
      return true;
    }
    return false;
  }
}
