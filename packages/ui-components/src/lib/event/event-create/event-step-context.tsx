'use client';

import { CompanyDTO, ContactDTO, RoleDTO } from '@job-tracker/validation';
import { Control } from 'react-hook-form';
import CompanyCombobox from '../../company/company-combobox';
import ContactCombobox from '../../contact/contact-combobox';
import RoleCombobox from '../../role/role-combobox';

export interface EventStepContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  onSearchContact: (query: string) => Promise<ContactDTO[]>;
  onSearchRole: (query: string) => Promise<RoleDTO[]>;
}

export function EventStepContext({
  control,
  onSearchCompany,
  onSearchContact,
  onSearchRole,
}: EventStepContextProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-base-content">Who and what is this about?</h2>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-base-content">Company (Optional)</span>
        </label>
        <CompanyCombobox control={control} name="company" onSearch={onSearchCompany} />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-base-content">Contact (Optional)</span>
        </label>
        <ContactCombobox control={control} name="contact" onSearch={onSearchContact} />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-base-content">Role (Optional)</span>
        </label>
        <RoleCombobox control={control} name="role" onSearch={onSearchRole} />
      </div>
    </div>
  );
}

export default EventStepContext;
