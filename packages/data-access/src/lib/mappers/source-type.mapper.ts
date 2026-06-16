import { SourceTypeEntity } from '@job-tracker/domain';
import { SourceTypeDTO } from '@job-tracker/validation';

import { SourceTypeDocument } from '../database/documents/source-type.document';

export class SourceTypeMapper {
  static toEntity(doc: SourceTypeDocument): SourceTypeEntity {
    return {
      id: doc.id,
      serverId: doc.serverId ?? null,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      name: doc.name,
      isSystemDefined: doc.isSystemDefined,
    };
  }

  static toDto(doc: SourceTypeDocument): SourceTypeDTO {
    return {
      id: doc.id,
      serverId: doc.serverId ?? null,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      name: doc.name,
      isSystemDefined: doc.isSystemDefined,
    };
  }

  static toDocument(
    entity: Partial<SourceTypeDTO> & { id: string; name: string },
  ): SourceTypeDocument {
    const now = new Date();
    return {
      id: entity.id,
      serverId: entity.serverId ?? null,
      updatedAt: entity.updatedAt ?? now.toISOString(),
      createdAt: entity.createdAt ?? now.toISOString(),

      name: entity.name,
      isSystemDefined: entity.isSystemDefined ?? false,
    };
  }
}
