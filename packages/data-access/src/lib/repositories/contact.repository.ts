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
import { ContactDTO } from '@job-tracker/validation';

import { TrackerDatabase } from '../database/db';
import { ContactDocument } from '../database/documents/contact.document';
import { ContactMapper } from '../mappers/contact.mapper';

export class ContactRepository {
  constructor(private readonly db: TrackerDatabase) {}

  list$(): Observable<ContactDTO[]> {
    return this.db.contacts
      .find({
        sort: [{ lastName: 'asc' }, { firstName: 'asc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => ContactMapper.toDto(doc.toJSON()))));
  }

  listByCompanyId$(companyId: string): Observable<ContactDTO[]> {
    return this.db.contacts
      .find({
        selector: { companyId },
        sort: [{ lastName: 'asc' }, { firstName: 'asc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => ContactMapper.toDto(doc.toJSON()))));
  }

  async getById(id: string): Promise<ContactDTO | null> {
    const doc = await this.db.contacts.findOne(id).exec();
    if (!doc) return null;
    return ContactMapper.toDto(doc.toJSON());
  }

  async create(
    contact: Partial<ContactDTO> & { id: string; firstName: string; lastName: string },
  ): Promise<ContactDTO> {
    const timestamps = createAuditTimestamps();
    const doc = ContactMapper.toDocument({
      ...(contact as Parameters<typeof ContactMapper.toDocument>[0]),
      ...timestamps,
    });

    const inserted = await this.db.contacts.insert(doc);
    return ContactMapper.toDto(inserted.toJSON());
  }

  async update(
    id: string,
    contact: Partial<ContactDTO> & { firstName?: string; lastName?: string },
  ): Promise<ContactDTO | null> {
    const existing = await this.db.contacts.findOne(id).exec();
    if (!existing) return null;

    const existingDoc = existing.toJSON();
    const merged = ContactMapper.toDocument({
      ...existingDoc,
      ...(contact as Parameters<typeof ContactMapper.toDocument>[0]),
      id,
      firstName: contact.firstName ?? existingDoc.firstName,
      lastName: contact.lastName ?? existingDoc.lastName,
      updatedAt: createUpdatedAt(),
      createdAt: existingDoc.createdAt,
    });

    const updated = await this.db.contacts.upsert(merged);
    return ContactMapper.toDto(updated.toJSON());
  }

  async upsert(
    contact: Partial<ContactDTO> & { id: string; firstName: string; lastName: string },
  ): Promise<ContactDTO> {
    return upsertEntity(contact, {
      entityName: 'contact',
      create: (input) => this.create(input),
      update: (id, input) => this.update(id, input),
      findExisting: (id) => this.db.contacts.findOne(id).exec(),
    });
  }

  async searchByName(query: string, limit = DEFAULT_SEARCH_LIMIT): Promise<ContactDTO[]> {
    const normalizedInput = normalizeSearchInput(query, limit);
    if (!normalizedInput) return [];

    const docs = await this.db.contacts
      .find({
        selector: {
          search: {
            $regex: normalizedInput.pattern,
          },
        },
        sort: [{ lastName: 'asc' }, { firstName: 'asc' }],
        limit: normalizedInput.limit,
      })
      .exec();

    return docs.map((doc) => ContactMapper.toDto(doc.toJSON()));
  }

  async deleteById(id: string): Promise<boolean> {
    const doc = await this.db.contacts.findOne(id).exec();
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

  // Check if a Contact can be deleted (no related records)
  async checkDeletionBlockers(contactId: string): Promise<DeletionBlockers> {
    const eventsCount = await this.db.events.count({ selector: { contactId } }).exec();
    return {
      events: eventsCount,
      contacts: 0,
      roles: 0,
    };
  }

  // Subscribe to deletion check for a Contact
  subscribeToDeletionCheck(
    contactId: string,
    callback: (blockers: DeletionBlockers, canDelete: boolean) => void,
  ): () => void {
    const contactQuery = this.db.contacts.findOne({
      selector: { id: contactId },
    });

    const subscription = contactQuery.$.subscribe(async (contact: ContactDocument | null) => {
      if (!contact) {
        callback(EMPTY_DELETION_BLOCKERS, false);
        return;
      }

      const blockers = await this.checkDeletionBlockers(contactId);
      const canDelete = canDeleteEntity(blockers);

      callback(blockers, canDelete);
    });

    return () => subscription.unsubscribe();
  }
}
