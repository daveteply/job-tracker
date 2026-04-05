import { DirectionType, EventEntity, SourceType } from '@job-tracker/domain';
import { EventDTO } from '@job-tracker/validation';
import { EventDocument } from '../database/documents/event.document';

export class EventMapper {
  static toEntity(doc: EventDocument): EventEntity {
    return {
      id: doc.id,
      serverId: doc.serverId ?? 0,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      eventTypeId: doc.eventTypeId,
      companyId: doc.companyId || undefined,
      contactId: doc.contactId || undefined,
      roleId: doc.roleId || undefined,

      occurredAt: new Date(doc.occurredAt),
      source: doc.source || SourceType.Email,
      direction: doc.direction || DirectionType.Inbound,
      summary: doc.summary || undefined,
      details: doc.details || undefined,
    };
  }

  static toDto(doc: EventDocument): EventDTO {
    return {
      id: doc.id,
      serverId: doc.serverId,

      eventTypeId: doc.eventTypeId,
      companyId: doc.companyId || null,
      contactId: doc.contactId || null,
      roleId: doc.roleId || null,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      occurredAt: new Date(doc.occurredAt),
      source: doc.source,
      direction: doc.direction,
      summary: doc.summary,
      details: doc.details,
    };
  }

  static toDocument(
    entity: Partial<Omit<EventDTO, 'occurredAt'>> & { occurredAt?: string | Date; id: string },
  ): EventDocument {
    const now = new Date();
    const document: EventDocument = {
      id: entity.id,
      serverId: entity.serverId ?? null,
      updatedAt: entity.updatedAt ?? now.toISOString(),
      createdAt: entity.createdAt ?? now.toISOString(),

      companyId: entity.companyId ?? '',
      contactId: entity.contactId ?? '',
      roleId: entity.roleId ?? '',
      eventTypeId: entity.eventTypeId ?? '',

      occurredAt: (entity.occurredAt instanceof Date
        ? entity.occurredAt
        : entity.occurredAt
          ? new Date(entity.occurredAt)
          : now
      ).toISOString(),
      source: entity.source ?? SourceType.Email,
      direction: entity.direction ?? DirectionType.Inbound,
      summary: entity.summary ?? null,
      details: entity.details ?? null,
    };

    return document;
  }
}
