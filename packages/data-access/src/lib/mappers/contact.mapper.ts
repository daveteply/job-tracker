import { ContactEntity } from '@job-tracker/domain';
import { ContactDTO } from '@job-tracker/validation';
import { ContactDocument } from '../database/documents/contact.document';

export class ContactMapper {
  static toEntity(doc: ContactDocument): ContactEntity {
    return {
      id: doc.id,
      serverId: doc.serverId ?? 0,
      version: doc.version,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      companyId: doc.companyId || undefined,

      firstName: doc.firstName,
      lastName: doc.lastName,
      title: doc.title ?? undefined,
      email: doc.email ?? undefined,
      phoneNumber: doc.phoneNumber ?? undefined,
      linkedInUrl: doc.linkedInUrl ?? undefined,
      isPrimaryRecruiter: doc.isPrimaryRecruiter ?? false,
      notes: doc.notes ?? undefined,
    };
  }

  static toDto(doc: ContactDocument): ContactDTO {
    return {
      id: doc.id,
      serverId: doc.serverId,
      version: doc.version,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      companyId: doc.companyId || null,

      firstName: doc.firstName,
      lastName: doc.lastName,
      title: doc.title,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      linkedInUrl: doc.linkedInUrl,
      isPrimaryRecruiter: doc.isPrimaryRecruiter,
      notes: doc.notes,
    };
  }

  static toDocument(
    entity: Partial<ContactDTO> & { id: string; firstName: string; lastName: string },
  ): ContactDocument {
    const now = new Date().toISOString();
    const document: ContactDocument = {
      id: entity.id,
      serverId: entity.serverId ?? null,
      version: entity.version ?? 0,
      updatedAt: entity.updatedAt ?? now,
      createdAt: entity.createdAt ?? now,

      companyId: entity.companyId ?? '',

      firstName: entity.firstName,
      lastName: entity.lastName,
      title: entity.title ?? null,
      email: entity.email ?? null,
      phoneNumber: entity.phoneNumber ?? null,
      linkedInUrl: entity.linkedInUrl ?? null,
      isPrimaryRecruiter: entity.isPrimaryRecruiter ?? false,
      notes: entity.notes ?? null,
    };

    return document;
  }
}
