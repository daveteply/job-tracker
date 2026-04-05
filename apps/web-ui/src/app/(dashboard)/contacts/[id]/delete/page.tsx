'use client';

import { use } from 'react';
import { useCanDeleteContact, useContactActions, useContactWithCompany } from '@job-tracker/hooks';
import { ContactInfoCard, EntityDelete, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';

export default function DeleteContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { contact, loading } = useContactWithCompany(id);

  const { removeContact } = useContactActions();
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteContact(id);

  if (loading || deleteCheckLoading) return <PageLoading entityName="contact" />;
  if (!contact) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl pr-1">Contact - Delete</h1>

      <>
        <ContactInfoCard contact={contact} showControls={false} />
        {canDelete ? (
          <EntityDelete
            id={id}
            onDeleteAction={removeContact}
            entityName="Contact"
            postActionRoute="/contacts"
          />
        ) : (
          <>
            <p>{`This Contact is associated with
                 ${blockers.events} Event(s), 
                 ${blockers.contacts} Contact(s) or 
                 ${blockers.roles} Role(s) and cannot be deleted`}</p>
            <div className="flex">
              <Link className="btn btn-info mr-3" href="/contacts">
                Back to Contacts
              </Link>
              <Link className="btn btn-info" href="/activity">
                Back to Events
              </Link>
            </div>
          </>
        )}
      </>
    </div>
  );
}
