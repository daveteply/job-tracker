'use client';

import { CompanyDTO, ContactDTO, RoleDTO } from '@job-tracker/validation';
import { Control, FieldValues, Path } from 'react-hook-form';
import CompanyCombobox from '../../company/company-combobox';
import ContactCombobox from '../../contact/contact-combobox';
import RoleCombobox from '../../role/role-combobox';

export interface EventStepContextProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  onSearchContact: (query: string) => Promise<ContactDTO[]>;
  onSearchRole: (query: string) => Promise<RoleDTO[]>;
}

export function EventStepContext<T extends FieldValues = FieldValues>({
  control,
  onSearchCompany,
  onSearchContact,
  onSearchRole,
}: EventStepContextProps<T>) {
  return (
    <div className="space-y-6">
      <h2 className="text-base-content text-lg font-semibold">Who and what is this about?</h2>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content font-medium">Company (Optional)</span>
        </label>
        <CompanyCombobox control={control} name={'company' as Path<T>} onSearch={onSearchCompany} />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content font-medium">Contact (Optional)</span>
        </label>
        <ContactCombobox control={control} name={'contact' as Path<T>} onSearch={onSearchContact} />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content font-medium">Role (Optional)</span>
        </label>
        <RoleCombobox control={control} name={'role' as Path<T>} onSearch={onSearchRole} />
      </div>
    </div>
  );
}

export default EventStepContext;
