'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { EntitySelection } from '@job-tracker/app-logic';
import { useCompanySearch, useContactActions, useContactWithCompany } from '@job-tracker/hooks';
import { ContactForm, PageLoading } from '@job-tracker/ui-components';
import { ContactDTO } from '@job-tracker/validation';

type ContactEditFormData = ContactDTO & {
  company?: EntitySelection | null;
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
          shouldRemove: false,
        }
      : null,
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">
          {t('editContactTitle', { firstName: contact.firstName, lastName: contact.lastName })}
        </h1>
      </div>
      {
        <ContactForm
          onSubmitAction={handleUpdate}
          onSearchCompany={searchCompanies}
          initialData={initialData}
          isEdit={true}
          postActionRoute={'/contacts'}
          companyPlaceholder={t('formPlaceholder')}
          createCompanyLabel={(name) => t('formCreateCompany', { name })}
        />
      }
    </div>
  );
}
