import { CompanyEntity } from '@job-tracker/domain';
import { CompanyDTO } from '@job-tracker/validation';
import { CompanyDocument } from '../database/documents/company.document';

export class CompanyMapper {
  static toEntity(doc: CompanyDocument): CompanyEntity {
    return {
      id: doc.id,
      serverId: doc.serverId ?? 0,
      version: doc.version,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      name: doc.name,
      search: doc.search,
      website: doc.website ?? undefined,
      industry: doc.industry ?? undefined,
      sizeRange: doc.sizeRange ?? undefined,
      notes: doc.notes ?? undefined,
    };
  }

  static toDto(doc: CompanyDocument): CompanyDTO {
    return {
      id: doc.id,
      serverId: doc.serverId,
      version: doc.version,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      name: doc.name,
      search: doc.search,
      website: doc.website,
      industry: doc.industry,
      sizeRange: doc.sizeRange,
      notes: doc.notes,
    };
  }

  static toDocument(entity: Partial<CompanyDTO> & { id: string; name: string }): CompanyDocument {
    const now = new Date().toISOString();

    return {
      id: entity.id,
      serverId: entity.serverId ?? null,
      version: entity.version ?? 0,
      updatedAt: entity.updatedAt ?? now,
      createdAt: entity.createdAt ?? now,

      name: entity.name,
      search: entity.name.toLowerCase(),
      website: entity.website ?? null,
      industry: entity.industry ?? null,
      sizeRange: entity.sizeRange ?? null,
      notes: entity.notes ?? null,
    };
  }
}
