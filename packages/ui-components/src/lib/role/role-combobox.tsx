'use client';

import { Control, FieldValues, Path } from 'react-hook-form';

import { RoleDTO } from '@job-tracker/validation';

import EntityCombobox from '../common/entity-combobox/entity-combobox';
import { roleComboboxConfig } from '../common/entity-combobox/entity-combobox-config';

interface RoleComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<RoleDTO[]>;
  required?: boolean;
  placeholder?: string;
  createNewLabel?: (input: string) => string;
  validateNewEntity?: (input: string) => string | null;
}

export function RoleCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
  placeholder,
  createNewLabel,
  validateNewEntity,
}: RoleComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={roleComboboxConfig}
      required={required}
      placeholder={placeholder}
      createNewLabel={createNewLabel}
      validateNewEntity={validateNewEntity}
    />
  );
}

export default RoleCombobox;
