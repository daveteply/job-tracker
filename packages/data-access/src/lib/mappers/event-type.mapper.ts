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
      translationKey: doc.translationKey,
      category: doc.category,
      targetStatus: doc.targetStatus,
      isSystemDefined: doc.isSystemDefined,
      isCommon: doc.isCommon,
    };
  }

  static toDto(doc: EventTypeDocument): EventTypeDTO {
    return {
      id: doc.id,
      serverId: doc.serverId,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      name: doc.name,
      translationKey: doc.translationKey,
      category: doc.category,
      targetStatus: doc.targetStatus ?? null,
      isSystemDefined: doc.isSystemDefined,
      isCommon: doc.isCommon,
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
      translationKey: entity.translationKey,
      category: entity.category ?? EventCategoryType.Application,
      targetStatus: entity.targetStatus,
      isSystemDefined: entity.isSystemDefined ?? false,
      isCommon: entity.isCommon ?? false,
    };

    return document;
  }
}
