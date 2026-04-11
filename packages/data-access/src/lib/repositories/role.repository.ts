import { map, Observable } from 'rxjs';
import { TrackerDatabase } from '../database/db';
import { RoleDTO } from '@job-tracker/validation';
import {
  canDeleteEntity,
  createAuditTimestamps,
  createUpdatedAt,
  DEFAULT_SEARCH_LIMIT,
  EMPTY_DELETION_BLOCKERS,
  normalizeSearchInput,
  upsertEntity,
  type DeletionBlockers,
} from '@job-tracker/app-logic';
import { RoleMapper } from '../mappers/role.mapper';
import { RoleDocument } from '../database/documents/role.document';

export class RoleRepository {
  constructor(private readonly db: TrackerDatabase) {}

  list$(): Observable<RoleDTO[]> {
    return this.db.roles
      .find({
        sort: [{ title: 'asc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => RoleMapper.toDto(doc.toJSON()))));
  }

  // Backward-compatible alias while consumers move to list$ naming.
  getAll$(): Observable<RoleDTO[]> {
    return this.list$();
  }

  async getById(id: string): Promise<RoleDTO | null> {
    const doc = await this.db.roles.findOne(id).exec();
    if (!doc) return null;
    return RoleMapper.toDto(doc.toJSON());
  }

  async create(role: Partial<RoleDTO> & { id: string; title: string }): Promise<RoleDTO> {
    const timestamps = createAuditTimestamps();
    const doc = RoleMapper.toDocument({
      ...(role as Parameters<typeof RoleMapper.toDocument>[0]),
      ...timestamps,
    });

    const inserted = await this.db.roles.insert(doc);
    return RoleMapper.toDto(inserted.toJSON());
  }

  async update(id: string, role: Partial<RoleDTO> & { title?: string }): Promise<RoleDTO | null> {
    const existing = await this.db.roles.findOne(id).exec();
    if (!existing) return null;

    const existingDoc = existing.toJSON();
    const merged = RoleMapper.toDocument({
      ...existingDoc,
      ...(role as Parameters<typeof RoleMapper.toDocument>[0]),
      id,
      title: role.title ?? existingDoc.title,
      updatedAt: createUpdatedAt(),
      createdAt: existingDoc.createdAt,
    });

    const updated = await this.db.roles.upsert(merged);
    return RoleMapper.toDto(updated.toJSON());
  }

  async upsert(role: Partial<RoleDTO> & { id: string; title: string }): Promise<RoleDTO> {
    return upsertEntity(role, {
      entityName: 'role',
      create: (input) => this.create(input),
      update: (id, input) => this.update(id, input),
      findExisting: (id) => this.db.roles.findOne(id).exec(),
    });
  }

  async searchByName(query: string, limit = DEFAULT_SEARCH_LIMIT): Promise<RoleDTO[]> {
    const normalizedInput = normalizeSearchInput(query, limit);
    if (!normalizedInput) return [];

    const docs = await this.db.roles
      .find({
        selector: {
          search: {
            $regex: normalizedInput.pattern,
          },
        },
        sort: [{ title: 'asc' }],
        limit: normalizedInput.limit,
      })
      .exec();

    return docs.map((doc) => RoleMapper.toDto(doc.toJSON()));
  }

  async deleteById(id: string): Promise<boolean> {
    const doc = await this.db.roles.findOne(id).exec();
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

  // Check if a Role can be deleted (no related records)
  async checkDeletionBlockers(roleId: string): Promise<DeletionBlockers> {
    const eventsCount = await this.db.events.count({ selector: { roleId } }).exec();
    return {
      events: eventsCount,
      contacts: 0,
      roles: 0,
    };
  }

  // Subscribe to deletion check for a Role
  subscribeToDeletionCheck(
    roleId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ): () => void {
    const roleQuery = this.db.roles.findOne({
      selector: { id: roleId },
    });

    const subscription = roleQuery.$.subscribe(async (role: RoleDocument | null) => {
      if (!role) {
        callback(EMPTY_DELETION_BLOCKERS, false);
        return;
      }

      const blockers = await this.checkDeletionBlockers(roleId);
      const canDelete = canDeleteEntity(blockers);

      callback(blockers, canDelete);
    });

    return () => subscription.unsubscribe();
  }
}
