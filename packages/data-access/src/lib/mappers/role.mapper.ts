import { RoleEntity } from '@job-tracker/domain';
import { RoleDocument } from '../database/documents/role.document';
import { RoleDTO } from '@job-tracker/validation';
import { RoleStatus } from 'packages/domain/src/lib/common/role-status-type';

export class RoleMapper {
  static toEntity(doc: RoleDocument): RoleEntity {
    return {
      id: doc.id,
      serverId: doc.serverId ?? 0,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      companyId: doc.companyId || undefined,

      title: doc.title,
      jobPostingUrl: doc.jobPostingUrl ?? undefined,
      location: doc.location ?? undefined,
      level: doc.level ?? undefined,
      salaryRange: doc.salaryRange ?? undefined,
      notes: doc.notes ?? undefined,
      status: doc.status ?? RoleStatus.Lead,
    };
  }

  static toDto(doc: RoleDocument): RoleDTO {
    return {
      id: doc.id,
      serverId: doc.serverId,
      updatedAt: doc.updatedAt,
      createdAt: doc.createdAt,

      companyId: doc.companyId || null,

      title: doc.title,
      jobPostingUrl: doc.jobPostingUrl ?? undefined,
      location: doc.location ?? undefined,
      level: doc.level ?? undefined,
      salaryRange: doc.salaryRange ?? undefined,
      notes: doc.notes ?? undefined,
      status: doc.status ?? RoleStatus.Lead,
    };
  }

  static toDocument(entity: Partial<RoleDTO> & { id: string; title: string }): RoleDocument {
    const now = new Date().toISOString();
    const document: RoleDocument = {
      id: entity.id,
      serverId: entity.serverId ?? null,
      updatedAt: entity.updatedAt ?? now,
      createdAt: entity.createdAt ?? now,

      companyId: entity.companyId ?? '',

      title: entity.title,
      jobPostingUrl: entity.jobPostingUrl ?? null,
      location: entity.location ?? null,
      level: entity.level ?? null,
      salaryRange: entity.salaryRange ?? null,
      notes: entity.notes ?? null,
      status: entity.status ?? RoleStatus.Lead,
    };
    return document;
  }
}
