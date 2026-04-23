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
import { FloatingButtonContainer } from '../common/floating-button-container';
import { inferDirectionFromEventType } from '@job-tracker/app-logic';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Events');
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
    setValue,
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
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 mx-auto mb-4 max-w-md pb-8">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formEventType')}</legend>
        <Controller
          name={'eventTypeId' as Path<T>}
          control={control}
          render={({ field, fieldState }) => (
            <EventTypeSelect
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                const selectedType = eventTypes.find((t) => t.id === val);
                if (selectedType) {
                  const inferredDirection = inferDirectionFromEventType(selectedType.name);
                  if (inferredDirection) {
                    setValue('direction' as Path<T>, inferredDirection as any, {
                      shouldValidate: true,
                    });
                  }
                }
              }}
              options={eventTypes}
              isLoading={eventTypesLoading}
              error={fieldState.error?.message} // fieldState automatically finds the error for this name
            />
          )}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formDirection')}</legend>
        <EnumSelector
          register={register('direction' as Path<T>)}
          enumObject={DirectionType}
          useButtons={true}
          translationNamespace="DirectionType"
        />
        <ErrorMsg name={'direction' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">{t('formSource')}</legend>
        <EnumSelector
          register={register('source' as Path<T>)}
          enumObject={SourceType}
          translationNamespace="SourceType"
        />
        <ErrorMsg name={'source' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formCompany')}</legend>
        <CompanyCombobox control={control} name={'company' as Path<T>} onSearch={onSearchCompany} />
        <ErrorMsg name={'company' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formContact')}</legend>
        <ContactCombobox control={control} name={'contact' as Path<T>} onSearch={onSearchContact} />
        <ErrorMsg name={'contact.firstName' as Path<T>} />
        <ErrorMsg name={'contact.lastName' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formRole')}</legend>
        <RoleCombobox control={control} name={'role' as Path<T>} onSearch={onSearchRole} />
        <ErrorMsg name={'title' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formDateOccurred')}</legend>
        <input
          type="date"
          className="input"
          {...register('occurredAt' as Path<T>, { valueAsDate: true })}
        />
        <ErrorMsg name={'occurredAt' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formSummary')}</legend>
        <input className="input" {...register('summary' as Path<T>)} />
        <ErrorMsg name={'summary' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formDetails')}</legend>
        <textarea className="textarea" {...register('details' as Path<T>)} />
        <ErrorMsg name={'details' as Path<T>} />
      </fieldset>

      <FloatingButtonContainer>
        <Link href={postActionRoute} className="btn btn-ghost">
          {t('cancel')}
        </Link>
        <button className="btn btn-primary px-8" type="submit" disabled={isSubmitting}>
          {isEdit ? t('update') : t('create')}
        </button>
      </FloatingButtonContainer>
    </form>
  );
}

export default EventForm;
