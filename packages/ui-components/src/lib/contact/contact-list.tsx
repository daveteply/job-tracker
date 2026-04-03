'use client';

import { ContactDTO } from '@job-tracker/validation';
import ContactInfoCard from './contact-info-card';

export interface ContactListProps {
  contacts: ContactDTO[];
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <div className="flex flex-col gap-3">
      {contacts && contacts.length ? (
        <>
          {contacts.map((contact) => (
            <ContactInfoCard key={contact.id} contact={contact} />
          ))}
        </>
      ) : (
        <p>No Contacts found</p>
      )}
    </div>
  );
}

export default ContactList;
