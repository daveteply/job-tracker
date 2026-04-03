'use client';

import { CompanyDTO } from '@job-tracker/validation';
import { Control, FieldValues, Path } from 'react-hook-form';
import EntityCombobox from '../common/entity-combobox/entity-combobox';
import { companyComboboxConfig } from '../common/entity-combobox/entity-combobox-config';

interface CompanyComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<CompanyDTO[]>;
  required?: boolean;
}

export function CompanyCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
}: CompanyComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={companyComboboxConfig}
      required={required}
    />
  );
}

export default CompanyCombobox;
