import { EventCategoryType, EventTypeEntity } from '@job-tracker/domain';
import { EventTypeDTO } from '@job-tracker/validation';
import { EventTypeDocument } from '../database/documents/event-type.document';

export class EventTypeMapper {
  static toEntity(doc: EventTypeDocument): EventTypeEntity {
    return {
      id: doc.id,
      serverId: doc.serverId ?? 0,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      name: doc.name,
      category: doc.category,
      isSystemDefined: doc.isSystemDefined,
    };
  }

  static toDto(doc: EventTypeDocument): EventTypeDTO {
    return {
      id: doc.id,
      serverId: doc.serverId,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      name: doc.name,
      category: doc.category,
      isSystemDefined: doc.isSystemDefined,
    };
  }

  static toDocument(
    entity: Partial<EventTypeDTO> & { id: string; name: string },
  ): EventTypeDocument {
    const now = new Date().toISOString();
    const document: EventTypeDocument = {
      id: entity.id,
      serverId: entity.serverId ?? null,
      updatedAt: entity.updatedAt ?? now,
      createdAt: entity.createdAt ?? now,

      name: entity.name,
      category: entity.category ?? EventCategoryType.Application,
      isSystemDefined: entity.isSystemDefined ?? false,
    };

    return document;
  }
}
