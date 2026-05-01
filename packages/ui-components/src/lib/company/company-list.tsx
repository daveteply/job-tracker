'use client';

import { useTranslations } from 'next-intl';

import { CompanyWithRolesDTO } from '@job-tracker/validation';

import CompanyInfoCard from './company-info-card';

export interface CompanyListProps {
  companies: CompanyWithRolesDTO[];
  noCompaniesMessage?: string;
}

export function CompanyList({ companies, noCompaniesMessage }: CompanyListProps) {
  const t = useTranslations('Companies');
  const message = noCompaniesMessage || t('noCompaniesFound');

  return (
    <div className="flex flex-col gap-3">
      {companies && companies.length ? (
        <>
          {companies.map((company) => (
            <CompanyInfoCard
              key={company.id}
              company={company}
              roles={company.roles}
              showRoles={false}
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
