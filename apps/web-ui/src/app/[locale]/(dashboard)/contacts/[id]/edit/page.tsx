'use client';

import { use } from 'react';
import { useCompanySearch, useContactActions, useContactWithCompany } from '@job-tracker/hooks';
import { ContactForm, PageLoading } from '@job-tracker/ui-components';
import { ContactDTO } from '@job-tracker/validation';
import { useTranslations } from 'next-intl';

type ContactEditFormData = ContactDTO & {
  company?: {
    id?: string;
    name?: string;
    isNew?: boolean;
    shouldRemove?: boolean;
    displayValue?: string;
  } | null;
};

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Contacts');
  const { id } = use(params);
  const { contact, loading } = useContactWithCompany(id);
  const { upsertContact } = useContactActions();
  const { searchCompanies } = useCompanySearch();

  if (loading) return <PageLoading entityName={t('contactEntityName')} />;
  if (!contact) return <div>{t('contactNotFound')}</div>;

  const handleUpdate = async (data: ContactEditFormData) => {
    return upsertContact({ ...data, id });
  };

  const initialData: ContactEditFormData = {
    ...contact,
    company: contact.company
      ? {
          id: contact.company.id,
          name: contact.company.name,
          isNew: false,
        }
      : null,
  };

  return (
    <>
      <h1 className="mb-5 text-xl">
        {t('editContactTitle', { firstName: contact.firstName, lastName: contact.lastName })}
      </h1>
      {
        <ContactForm
          onSubmitAction={handleUpdate}
          onSearchCompany={searchCompanies}
          initialData={initialData}
          isEdit={true}
          postActionRoute={'/contacts'}
        />
      }
    </>
  );
}
