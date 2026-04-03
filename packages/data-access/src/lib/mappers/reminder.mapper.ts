import { ReminderEntity } from '@job-tracker/domain';
import { ReminderDTO } from '@job-tracker/validation';
import { ReminderDocument } from '../database/documents/reminder.document';

export class ReminderMapper {
  static toEntity(doc: ReminderDocument): ReminderEntity {
    return {
      id: doc.id,
      serverId: doc.serverId ?? 0,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      eventId: doc.eventId || undefined,
      remindAt: new Date(doc.remindAt),
      completedAt: doc.completedAt ? new Date(doc.completedAt) : undefined,
    };
  }

  static toDto(doc: ReminderDocument): ReminderDTO {
    return {
      id: doc.id,
      serverId: doc.serverId,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      eventId: doc.eventId || '',
      remindAt: new Date(doc.remindAt),
      completedAt: doc.completedAt ? new Date(doc.completedAt) : null,
    };
  }

  static toDocument(
    entity: Partial<Omit<ReminderDTO, 'remindAt' | 'completedAt' | 'eventId' | 'serverId'>> & {
      remindAt?: string | Date;
      completedAt?: string | Date | null;
      eventId?: string | null;
      serverId?: number | null;
      updatedAt?: string;
      createdAt?: string;
      id: string;
    },
  ): ReminderDocument {
    const now = new Date();
    return {
      id: entity.id,
      serverId: entity.serverId ?? null,
      updatedAt: entity.updatedAt ?? now.toISOString(),
      createdAt: entity.createdAt ?? now.toISOString(),

      eventId: entity.eventId ?? null,
      remindAt: (entity.remindAt instanceof Date
        ? entity.remindAt
        : entity.remindAt
        ? new Date(entity.remindAt)
        : now
      ).toISOString(),
      completedAt: entity.completedAt
        ? (entity.completedAt instanceof Date
            ? entity.completedAt
            : new Date(entity.completedAt)
          ).toISOString()
        : null,
    };
  }
}
