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
  placeholder?: string;
  createNewLabel?: (input: string) => string;
  validateNewEntity?: (input: string) => string | null;
}

export function CompanyCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
  placeholder,
  createNewLabel,
  validateNewEntity,
}: CompanyComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={companyComboboxConfig}
      required={required}
      placeholder={placeholder}
      createNewLabel={createNewLabel}
      validateNewEntity={validateNewEntity}
    />
  );
}

export default CompanyCombobox;
