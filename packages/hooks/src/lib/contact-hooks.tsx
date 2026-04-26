'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { combineLatest, map } from 'rxjs';

import { type EntitySelection, resolveCompanyId } from '@job-tracker/app-logic';
import { EMPTY_DELETION_BLOCKERS } from '@job-tracker/app-logic';
import {
  CompanyRepository,
  ContactRepository,
  DeletionCheck,
  useDb,
} from '@job-tracker/data-access';
import { ContactDTO, ContactWithCompanyDTO } from '@job-tracker/validation';

import { useObservable } from './use-observable';

export function useContactRepository() {
  const db = useDb();

  return useMemo(() => {
    if (!db) return null;
    return new ContactRepository(db);
  }, [db]);
}

export function useContactWithCompany(id: string) {
  const db = useDb();
  const contactRepository = useContactRepository();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);
  const [data, setData] = useState<ContactWithCompanyDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contactRepository && companyRepository && id) {
      setLoading(true);

      contactRepository
        .getById(id)
        .then(async (contact) => {
          if (!contact) {
            setData(null);
            return;
          }

          const company = contact.companyId
            ? await companyRepository.getById(contact.companyId)
            : null;

          setData({
            ...contact,
            company,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [contactRepository, companyRepository, id]);

  return { contact: data, loading };
}

export function useContactsWithCompany() {
  const db = useDb();
  const contactRepository = useContactRepository();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);

  const contactsWithCompany$ = useMemo(() => {
    if (!contactRepository || !companyRepository) {
      return undefined;
    }

    return combineLatest([contactRepository.list$(), companyRepository.list$()]).pipe(
      map(([contacts, companies]) => {
        const companiesById = new Map(companies.map((company) => [company.id, company]));

        return contacts.map<ContactWithCompanyDTO>((contact) => ({
          ...contact,
          company: contact.companyId ? (companiesById.get(contact.companyId) ?? null) : null,
        }));
      }),
    );
  }, [contactRepository, companyRepository]);

  const contacts = useObservable<ContactWithCompanyDTO[]>(contactsWithCompany$, []);

  return {
    contacts,
    loading: !contactRepository || !companyRepository,
  };
}

// Hook to check if a Contact can be deleted (checks for related records)
export function useCanDeleteContact(contactId: string): DeletionCheck {
  const repository = useContactRepository();
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState(EMPTY_DELETION_BLOCKERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId || !repository) return;

    const unsubscribe = repository.subscribeToDeletionCheck(
      contactId,
      (newBlockers, canDeleteValue) => {
        setBlockers(newBlockers);
        setCanDelete(canDeleteValue);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [contactId, repository]);

  return { canDelete, blockers, loading };
}

export function useContactSearch() {
  const repository = useContactRepository();

  const searchContacts = useCallback(
    async (query: string): Promise<ContactDTO[]> => {
      if (!repository) {
        return [];
      }

      return repository.searchByName(query);
    },
    [repository],
  );

  return {
    searchContacts,
    loading: !repository,
  };
}

export function useContactActions() {
  const db = useDb();
  const repository = useContactRepository();
  const companyRepository = useMemo(() => {
    if (!db) return null;
    return new CompanyRepository(db);
  }, [db]);

  type ContactUpsertInput = Partial<ContactDTO> & {
    company?: EntitySelection | null;
  };

  return {
    upsertContact: async (contact: ContactUpsertInput) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        const { company, ...contactData } = contact;

        const id = contactData.id || crypto.randomUUID();
        const firstName = (contactData.firstName || '').trim();
        const lastName = (contactData.lastName || '').trim();

        if (!firstName || !lastName) {
          return { success: false, message: 'Contact first and last names are required' };
        }

        const resolvedCompanyId = await resolveCompanyId({
          selection: company,
          currentCompanyId: contactData.companyId,
          upsertCompany: companyRepository ? (input) => companyRepository.upsert(input) : undefined,
        });

        await repository.upsert({
          ...contactData,
          companyId: resolvedCompanyId,
          id,
          firstName,
          lastName,
        });

        return { success: true, message: 'Contact saved successfully', id };
      } catch (error) {
        console.error('Failed to upsert Contact:', error);
        return { success: false, message: 'Failed to save Contact' };
      }
    },
    removeContact: async (id: string) => {
      if (!repository) {
        return { success: false, message: 'Database not initialized' };
      }

      try {
        await repository.deleteById(id);
        return { success: true, message: 'Contact removed successfully' };
      } catch (error) {
        console.error('Failed to remove Contact:', error);
        return { success: false, message: 'Failed to remove Contact' };
      }
    },
  };
}
