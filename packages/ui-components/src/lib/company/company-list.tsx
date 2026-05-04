'use client';

import { useTranslations } from 'next-intl';

import { CompanyWithChildrenDTO } from '@job-tracker/validation';

import CompanyInfoCard from './company-info-card';

export interface CompanyListProps {
  companies: CompanyWithChildrenDTO[];
  noCompaniesMessage?: string;
  showRoles?: boolean;
  showContacts?: boolean;
}

export function CompanyList({
  companies,
  noCompaniesMessage,
  showRoles = false,
  showContacts = false,
}: CompanyListProps) {
  const t = useTranslations('Companies');
  const message = noCompaniesMessage || t('noCompaniesFound');

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies && companies.length ? (
        <>
          {companies.map((company) => (
            <CompanyInfoCard
              key={company.id}
              company={company}
              roles={company.roles}
              contacts={company.contacts}
              showRoles={showRoles}
              showContacts={showContacts}
            />
          ))}
        </>
      ) : (
        <p className="px-1 text-sm italic opacity-50">{message}</p>
      )}
    </div>
  );
}

export default CompanyList;
