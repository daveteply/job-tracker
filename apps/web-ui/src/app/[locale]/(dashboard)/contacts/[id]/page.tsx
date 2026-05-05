'use client';

import { use } from 'react';

import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

import { useContactWithCompany } from '@job-tracker/hooks';
import { ContactInfoCard, PageLoading } from '@job-tracker/ui-components';

import { Link } from '../../../../../i18n/routing';

export default function ContactDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Contacts');
  const { id } = use(params);
  const { contact, loading } = useContactWithCompany(id);

  if (loading) return <PageLoading entityName={t('contactEntityName')} />;
  if (!contact) return <div>{t('contactNotFound')}</div>;

  return (
    <>
      <div className="mb-6 flex items-center">
        <h1 className="px-1 text-2xl font-bold">{t('contactDetails')}</h1>
        <Link
          className="btn btn-circle btn-sm text-primary ml-1"
          href={`${id}/edit`}
          title={t('editContact')}
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error ml-1"
          href={`${id}/delete`}
          title={t('deleteContact')}
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <ContactInfoCard contact={contact} showControls={false} showChevron={false} />

      <div className="mt-5">
        <Link className="btn" href="/contacts">
          {t('backToContacts')}
        </Link>
      </div>
    </>
  );
}
