'use client';

import { use } from 'react';
import { useContactWithCompany } from '@job-tracker/hooks';
import { ContactInfoCard, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

export default function ContactDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { contact, loading } = useContactWithCompany(id);

  if (loading) return <PageLoading entityName="contact" />;
  if (!contact) return <div>Contact not found</div>;

  return (
    <>
      <div className="mb-3 flex">
        <h1 className="pr-2 text-xl">Contact Details</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${id}/edit`}
          title="Edit Contact"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title="Delete Contact"
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <ContactInfoCard contact={contact} showControls={false} />

      <div className="mt-5">
        <Link className="btn" href="/contacts">
          Back to Contacts
        </Link>
      </div>
    </>
  );
}
