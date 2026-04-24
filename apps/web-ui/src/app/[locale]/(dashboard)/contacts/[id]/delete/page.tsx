'use client';

import { use } from 'react';
import { useCanDeleteContact, useContactActions, useContactWithCompany } from '@job-tracker/hooks';
import { ContactInfoCard, EntityDelete, PageLoading } from '@job-tracker/ui-components';
import { Link } from '../../../../../../i18n/routing';
import { useTranslations } from 'next-intl';

export default function DeleteContactPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Contacts');
  const tCommon = useTranslations('Common');
  const { id } = use(params);
  const { contact, loading } = useContactWithCompany(id);

  const { removeContact } = useContactActions();
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteContact(id);

  if (loading || deleteCheckLoading) return <PageLoading entityName={t('contactEntityName')} />;
  if (!contact) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pr-1 text-xl">{t('deleteContactTitle')}</h1>

      <>
        <ContactInfoCard contact={contact} showControls={false} />
        {canDelete ? (
          <EntityDelete
            id={id}
            onDeleteAction={removeContact}
            entityName={t('contactEntityName')}
            postActionRoute="/contacts"
            translations={{
              reminder: tCommon('deleteReminder'),
              confirm: tCommon('deleteAction', { name: t('contactEntityName') }),
              cancel: tCommon('cancel'),
              success: tCommon('deleteSuccess', { name: t('contactEntityName') }),
              error: tCommon('deleteError', { name: t('contactEntityName') }),
            }}
          />
        ) : (
          <>
            <p>
              {t('deleteBlocker', {
                events: blockers.events,
              })}
            </p>
            <div className="flex">
              <Link className="btn btn-info mr-3" href="/contacts">
                {t('backToContacts')}
              </Link>
              <Link className="btn btn-info" href="/activity">
                {t('backToEvents')}
              </Link>
            </div>
          </>
        )}
      </>
    </div>
  );
}
