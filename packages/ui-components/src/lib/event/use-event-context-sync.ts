'use client';

import { useEffect, useRef } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { determineRoleOnCompanyChange, EntitySelection } from '@job-tracker/app-logic';
import { CompanyDTO, ContactDTO, RoleDTO } from '@job-tracker/validation';

export interface UseEventContextSyncProps<T extends FieldValues = FieldValues> {
  setValue?: (
    name: Path<T>,
    value: PathValue<T, Path<T>>,
    options?: { shouldValidate?: boolean },
  ) => void;
  watch?: (name: Path<T>) => unknown;
  onSearchRole: (query: string, companyId?: string | null) => Promise<RoleDTO[]>;
}

export function useEventContextSync<T extends FieldValues = FieldValues>({
  setValue: customSetValue,
  watch: customWatch,
  onSearchRole,
}: UseEventContextSyncProps<T>) {
  const formContext = useFormContext<T>();
  const setValue = customSetValue || formContext?.setValue;
  const watch = customWatch || formContext?.watch;

  const contact = watch
    ? ((watch('contact' as Path<T>) as (ContactDTO & { company?: CompanyDTO }) | null) ?? null)
    : null;
  const role = watch
    ? ((watch('role' as Path<T>) as (RoleDTO & { company?: CompanyDTO }) | null) ?? null)
    : null;
  const company = watch ? watch('company' as Path<T>) : null;

  const prevContactRef = useRef<typeof contact | undefined>(undefined);
  const prevRoleRef = useRef<typeof role | undefined>(undefined);
  const prevCompanyRef = useRef<typeof company | undefined>(undefined);

  useEffect(() => {
    if (!setValue) return;
    let isCancelled = false;
    const currentCompanyId = (company as EntitySelection | null)?.id;
    const prevCompanyId = (prevCompanyRef.current as EntitySelection | null)?.id;

    // If role changed and has an associated company, set company ONLY if company is currently empty
    if (role?.id !== prevRoleRef.current?.id) {
      if (role?.company && !company) {
        const selection: EntitySelection = {
          ...role.company,
          isNew: false,
          shouldRemove: false,
        };
        setValue('company' as Path<T>, selection as PathValue<T, Path<T>>, {
          shouldValidate: true,
        });
      }
    }
    // If contact changed and has an associated company, only fill if company is currently empty
    else if (contact?.id !== prevContactRef.current?.id) {
      if (contact?.company && !company) {
        const selection: EntitySelection = {
          ...contact.company,
          isNew: false,
          shouldRemove: false,
        };
        setValue('company' as Path<T>, selection as PathValue<T, Path<T>>, {
          shouldValidate: true,
        });
      }
    }
    // If company changed, check company roles for single role auto-fill or title matching
    else if (currentCompanyId !== prevCompanyId) {
      if (currentCompanyId) {
        onSearchRole('', currentCompanyId).then((companyRoles) => {
          if (isCancelled) return;

          const targetRole = determineRoleOnCompanyChange(role?.title, companyRoles);
          if (targetRole) {
            setValue(
              'role' as Path<T>,
              {
                ...targetRole,
                isNew: false,
                shouldRemove: false,
              } as PathValue<T, Path<T>>,
              { shouldValidate: true },
            );
          } else {
            setValue('role' as Path<T>, null as PathValue<T, Path<T>>, { shouldValidate: true });
          }
        });
      } else {
        if (role && role.companyId) {
          setValue('role' as Path<T>, null as PathValue<T, Path<T>>, { shouldValidate: true });
        }
      }
    }

    prevContactRef.current = contact;
    prevRoleRef.current = role;
    prevCompanyRef.current = company;

    return () => {
      isCancelled = true;
    };
  }, [contact, role, company, setValue, onSearchRole]);
}

export default useEventContextSync;
