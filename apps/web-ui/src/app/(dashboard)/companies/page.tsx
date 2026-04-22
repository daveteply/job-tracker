'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useCompanies } from '@job-tracker/hooks';
import { CompanyList, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';

export default function CompaniesListPage() {
  const { companies, loading } = useCompanies();

  if (loading) return <PageLoading entityName="companies" />;

  return (
    <>
      <div className="mb-3 flex justify-between">
        <h1 className="pr-1 text-xl">Companies</h1>
        <Link className="btn btn-sm text-primary" href="companies/new" title="Add Company">
          <PlusCircleIcon className="size-5" />
          Add Company
        </Link>
      </div>

      <CompanyList companies={companies} />
    </>
  );
}
