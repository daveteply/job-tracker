import { map, Observable } from 'rxjs';

import {
  canDeleteEntity,
  createAuditTimestamps,
  createUpdatedAt,
  DEFAULT_SEARCH_LIMIT,
  type DeletionBlockers,
  EMPTY_DELETION_BLOCKERS,
  normalizeSearchInput,
  upsertEntity,
} from '@job-tracker/app-logic';
import { CompanyDTO } from '@job-tracker/validation';

import { TrackerDatabase } from '../database/db';
import { CompanyDocument } from '../database/documents/company.document';
import { CompanyMapper } from '../mappers/company.mapper';

export class CompanyRepository {
  constructor(private readonly db: TrackerDatabase) {}

  list$(): Observable<CompanyDTO[]> {
    return this.db.companies
      .find({
        sort: [{ name: 'asc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => CompanyMapper.toDto(doc.toJSON()))));
  }

  // Backward-compatible alias while consumers move to list$ naming.
  getAll$(): Observable<CompanyDTO[]> {
    return this.list$();
  }

  async getById(id: string): Promise<CompanyDTO | null> {
    const doc = await this.db.companies.findOne(id).exec();
    if (!doc) return null;
    return CompanyMapper.toDto(doc.toJSON());
  }

  async create(company: Partial<CompanyDTO> & { id: string; name: string }): Promise<CompanyDTO> {
    const timestamps = createAuditTimestamps();
    const doc = CompanyMapper.toDocument({
      ...(company as Parameters<typeof CompanyMapper.toDocument>[0]),
      ...timestamps,
    });

    const inserted = await this.db.companies.insert(doc);
    return CompanyMapper.toDto(inserted.toJSON());
  }

  async update(
    id: string,
    company: Partial<CompanyDTO> & { name?: string },
  ): Promise<CompanyDTO | null> {
    const existing = await this.db.companies.findOne(id).exec();
    if (!existing) return null;

    const existingDoc = existing.toJSON();
    const merged = CompanyMapper.toDocument({
      ...existingDoc,
      ...(company as Parameters<typeof CompanyMapper.toDocument>[0]),
      id,
      name: company.name ?? existingDoc.name,
      updatedAt: createUpdatedAt(),
      createdAt: existingDoc.createdAt,
    });

    const updated = await this.db.companies.upsert(merged);
    return CompanyMapper.toDto(updated.toJSON());
  }

  async upsert(company: Partial<CompanyDTO> & { id: string; name: string }): Promise<CompanyDTO> {
    return upsertEntity(company, {
      entityName: 'company',
      create: (input) => this.create(input),
      update: (id, input) => this.update(id, input),
      findExisting: (id) => this.db.companies.findOne(id).exec(),
    });
  }

  async searchByName(query: string, limit = DEFAULT_SEARCH_LIMIT): Promise<CompanyDTO[]> {
    const normalizedInput = normalizeSearchInput(query, limit);
    if (!normalizedInput) return [];

    const docs = await this.db.companies
      .find({
        selector: {
          search: {
            $regex: normalizedInput.pattern,
          },
        },
        sort: [{ name: 'asc' }],
        limit: normalizedInput.limit,
      })
      .exec();

    return docs.map((doc) => CompanyMapper.toDto(doc.toJSON()));
  }

  async deleteById(id: string): Promise<boolean> {
    const doc = await this.db.companies.findOne(id).exec();
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

  // Check if a Company can be deleted (no related records)
  async checkDeletionBlockers(companyId: string): Promise<DeletionBlockers> {
    const [eventsCount, contactsCount, rolesCount] = await Promise.all([
      this.db.events.count({ selector: { companyId } }).exec(),
      this.db.contacts.count({ selector: { companyId } }).exec(),
      this.db.roles.count({ selector: { companyId } }).exec(),
    ]);

    return {
      events: eventsCount,
      contacts: contactsCount,
      roles: rolesCount,
    };
  }

  // Subscribe to deletion check for a Company
  subscribeToDeletionCheck(
    companyId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ): () => void {
    const companyQuery = this.db.companies.findOne({
      selector: { id: companyId },
    });

    const subscription = companyQuery.$.subscribe(async (company: CompanyDocument | null) => {
      if (!company) {
        callback(EMPTY_DELETION_BLOCKERS, false);
        return;
      }

      const blockers = await this.checkDeletionBlockers(companyId);
      const canDelete = canDeleteEntity(blockers);

      callback(blockers, canDelete);
    });

    return () => subscription.unsubscribe();
  }
}
