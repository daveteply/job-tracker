'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useContactsWithCompany } from '@job-tracker/hooks';
import { ContactList, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';

export default function ContactsListPage() {
  const { contacts, loading } = useContactsWithCompany();

  if (loading) return <PageLoading entityName="contacts" />;

  return (
    <>
      <div className="flex mb-3 justify-between">
        <h1 className="text-xl pr-1">Contacts</h1>
        <Link className="btn btn-sm text-primary" href="contacts/new" title="Add Contact">
          <PlusCircleIcon className="size-5" />
          Add Contact
        </Link>
      </div>

      <ContactList contacts={contacts} />
    </>
  );
}
