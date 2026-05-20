'use client';

import PlusCircleIcon from '@heroicons/react/16/solid/PlusCircleIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import { useTranslations } from 'next-intl';

import { useContactsWithCompany } from '@job-tracker/hooks';
import { ContactList, EmptyState, PageHeader, PageLoading } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function ContactsListPage() {
  const t = useTranslations('Contacts');
  const { contacts, loading } = useContactsWithCompany();

  if (loading) return <PageLoading entityName={t('contactsEntityName')} />;

  return (
    <>
      <PageHeader title={t('listTitle')}>
        <Link className="btn btn-sm text-primary" href="contacts/new" title={t('addContact')}>
          <PlusCircleIcon className="size-5" />
          {t('addContact')}
        </Link>
      </PageHeader>

      {contacts.length === 0 ? (
        <EmptyState
          icon={<UserGroupIcon className="h-16 w-16" />}
          title={t('noContactsFound')}
          description={t('emptyStateDescription')}
          action={
            <Link href="contacts/new" className="btn btn-primary gap-2">
              <PlusCircleIcon className="h-5 w-5" />
              {t('addContact')}
            </Link>
          }
        />
      ) : (
        <ContactList contacts={contacts} />
      )}
    </>
  );
}
