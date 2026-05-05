'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

import { useContactsWithCompany } from '@job-tracker/hooks';
import { ContactList, PageLoading } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function ContactsListPage() {
  const t = useTranslations('Contacts');
  const { contacts, loading } = useContactsWithCompany();

  if (loading) return <PageLoading entityName={t('contactsEntityName')} />;

  return (
    <>
      <div className="mb-6 flex justify-between">
        <h1 className="px-1 text-2xl font-bold">{t('listTitle')}</h1>
        <Link className="btn btn-sm text-primary" href="contacts/new" title={t('addContact')}>
          <PlusCircleIcon className="size-5" />
          {t('addContact')}
        </Link>
      </div>

      <ContactList contacts={contacts} />
    </>
  );
}
