'use client';

import { ContactDTO } from '@job-tracker/validation';
import ContactInfoCard from './contact-info-card';
import { useTranslations } from 'next-intl';

export interface ContactListProps {
  contacts: ContactDTO[];
  noContactsMessage?: string;
}

export function ContactList({ contacts, noContactsMessage }: ContactListProps) {
  const t = useTranslations('Contacts');
  const message = noContactsMessage || t('noContactsFound');

  return (
    <div className="flex flex-col gap-3">
      {contacts && contacts.length ? (
        <>
          {contacts.map((contact) => (
            <ContactInfoCard key={contact.id} contact={contact} />
          ))}
        </>
      ) : (
        <p className="px-1 text-sm italic opacity-50">{message}</p>
      )}
    </div>
  );
}

export default ContactList;
