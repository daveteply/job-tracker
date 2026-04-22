'use client';

import CompanyInfoCard from './company-info-card';
import { CompanyDTO } from '@job-tracker/validation';

export interface CompanyListProps {
  companies: CompanyDTO[];
}

export function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="flex flex-col gap-3">
      {companies && companies.length ? (
        <>
          {companies.map((company) => (
            <CompanyInfoCard key={company.id} company={company} />
          ))}
        </>
      ) : (
        <p className="px-1 text-sm italic opacity-50">No Companies found</p>
      )}
    </div>
  );
}

export default CompanyList;
