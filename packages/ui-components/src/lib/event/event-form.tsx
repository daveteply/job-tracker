'use client';

import { useEffect, useMemo } from 'react';
import { Controller, DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CompanyDTO,
  ContactDTO,
  EventCreateSchema,
  EventTypeDTO,
  EventUpdateSchema,
  RoleDTO,
} from '@job-tracker/validation';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';

import ContactCombobox from '../contact/contact-combobox';
import RoleCombobox from '../role/role-combobox';
import { EnumSelector } from '../common/enum-selector';
import CompanyCombobox from '../company/company-combobox';
import Link from 'next/link';
import EventTypeSelect from '../event-type/event-type-select';
import { DirectionType, SourceType } from '@job-tracker/domain';

interface EventFormValues extends FieldValues {
  occurredAt?: Date | string | null;
}

interface EventFormProps<T extends EventFormValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  onSearchContact: (query: string) => Promise<ContactDTO[]>;
  onSearchRole: (query: string) => Promise<RoleDTO[]>;
  eventTypes: EventTypeDTO[];
  eventTypesLoading?: boolean;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  postActionRoute: string;
}

export function EventForm<T extends EventFormValues>({
  onSubmitAction,
  onSearchCompany,
  onSearchContact,
  onSearchRole,
  eventTypes,
  eventTypesLoading = false,
  initialData,
  isEdit = false,
  postActionRoute,
}: EventFormProps<T>) {
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? EventUpdateSchema : EventCreateSchema;

  const defaultDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const formatInitialData = useMemo(() => {
    return (data?: DefaultValues<T>): DefaultValues<T> => {
      const baseDefaults = {
        occurredAt: defaultDate,
        direction: DirectionType.Inbound,
      };

      if (!data) return baseDefaults as DefaultValues<T>;

      const result = { ...baseDefaults, ...data } as Record<string, unknown>;

      if (result['occurredAt']) {
        const date = new Date(result['occurredAt'] as string | number | Date);
        if (!isNaN(date.getTime())) {
          result['occurredAt'] = date.toISOString().split('T')[0];
        }
      }

      return result as DefaultValues<T>;
    };
  }, [defaultDate]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: formatInitialData(initialData),
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(formatInitialData(initialData));
    }
  }, [initialData, reset, formatInitialData]);

  const onSubmit = async (data: T) => {
    try {
      const result = await onSubmitAction(data);
      if (result.success) {
        showToast(`Event ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push(postActionRoute);
      } else {
        // TODO log this
        showToast('Could not save Event', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  // Helper to render error messages cleanly
  const ErrorMsg = ({ name }: { name: Path<T> }) => {
    // Access nested errors (e.g., 'contact.firstName')
    const nameParts = (name as string).split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = errors;
    for (const part of nameParts) {
      if (!error) break;
      error = error[part];
    }

    if (!error || !error.message) return null;
    return (
      <p className="text-red-600">
        <span>{error.message.toString()}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Event Type</legend>
        <Controller
          name={'eventTypeId' as Path<T>}
          control={control}
          render={({ field, fieldState }) => (
            <EventTypeSelect
              value={field.value}
              onChange={field.onChange}
              options={eventTypes}
              isLoading={eventTypesLoading}
              error={fieldState.error?.message} // fieldState automatically finds the error for this name
            />
          )}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Direction</legend>
        <EnumSelector
          register={register('direction' as Path<T>)}
          enumObject={DirectionType}
          useButtons={true}
        />
        <ErrorMsg name={'direction' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Source</legend>
        <EnumSelector register={register('source' as Path<T>)} enumObject={SourceType} />
        <ErrorMsg name={'source' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company</legend>
        <CompanyCombobox control={control} name={'company' as Path<T>} onSearch={onSearchCompany} />
        <ErrorMsg name={'company' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Contact</legend>
        <ContactCombobox control={control} name={'contact' as Path<T>} onSearch={onSearchContact} />
        <ErrorMsg name={'contact.firstName' as Path<T>} />
        <ErrorMsg name={'contact.lastName' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Role</legend>
        <RoleCombobox control={control} name={'role' as Path<T>} onSearch={onSearchRole} />
        <ErrorMsg name={'title' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Date Occurred</legend>
        <input
          type="date"
          className="input"
          {...register('occurredAt' as Path<T>, { valueAsDate: true })}
        />
        <ErrorMsg name={'occurredAt' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Summary (optional)</legend>
        <input className="input" {...register('summary' as Path<T>)} />
        <ErrorMsg name={'summary' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Details (optional)</legend>
        <textarea className="textarea" {...register('details' as Path<T>)} />
        <ErrorMsg name={'details' as Path<T>} />
      </fieldset>

      <div className="mt-4">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isEdit ? 'Update' : 'Create'}
        </button>
        <Link href={postActionRoute} className="btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default EventForm;
