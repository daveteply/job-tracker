'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Controller, DefaultValues, FieldValues, Path, PathValue, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { DirectionType, SourceType } from '@job-tracker/domain';
import { inferDirectionFromEventType } from '@job-tracker/hooks';
import {
  CompanyDTO,
  ContactDTO,
  EventCreateSchema,
  EventTypeDTO,
  EventUpdateSchema,
  RoleDTO,
} from '@job-tracker/validation';

import { useToast } from '../common/feedback/toast-context';
import { EnumSelector } from '../common/forms/enum-selector';
import { ErrorMsg } from '../common/forms/error-msg';
import { FloatingButtonContainer } from '../common/layout/floating-button-container';
import CompanyCombobox from '../company/company-combobox';
import ContactCombobox from '../contact/contact-combobox';
import EventTypeSelect from '../event-type/event-type-select';
import RoleCombobox from '../role/role-combobox';

import EventSummaryGenerator from './event-summary-generator';

interface EventFormValues extends FieldValues {
  occurredAt?: Date | string | null;
}

interface EventFormProps<T extends EventFormValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  onSearchContact: (query: string) => Promise<ContactDTO[]>;
  onSearchRole: (query: string, companyId?: string | null) => Promise<RoleDTO[]>;
  eventTypes: EventTypeDTO[];
  eventTypesLoading?: boolean;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  postActionRoute: string;
  companyPlaceholder?: string;
  contactPlaceholder?: string;
  rolePlaceholder?: string;
  createCompanyLabel?: (input: string) => string;
  createContactLabel?: (input: string) => string;
  createRoleLabel?: (input: string) => string;
  validateContact?: (input: string) => string | null;
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
  companyPlaceholder,
  contactPlaceholder,
  rolePlaceholder,
  createCompanyLabel,
  createContactLabel,
  createRoleLabel,
  validateContact,
}: EventFormProps<T>) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
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
    watch,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zodResolver with generic types often fails to overlap sufficiently in TS.
    resolver: zodResolver(schema as any),
    defaultValues: formatInitialData(initialData),
  });

  const eventTypeId = watch('eventTypeId' as Path<T>);
  const currentDirection = watch('direction' as Path<T>);
  const currentSource = watch('source' as Path<T>);
  const contact = watch('contact' as Path<T>) as (ContactDTO & { company?: CompanyDTO }) | null;
  const role = watch('role' as Path<T>) as (RoleDTO & { company?: CompanyDTO }) | null;
  const company = watch('company' as Path<T>) as CompanyDTO | null;
  const summaryValue = watch('summary' as Path<T>);

  const { isDirty: isSummaryDirty } = getFieldState('summary' as Path<T>, {
    errors,
    isSubmitting,
  } as any); // eslint-disable-line @typescript-eslint/no-explicit-any -- getFieldState state argument is complex to type manually

  const prevContactRef = useRef(contact);
  const prevRoleRef = useRef(role);
  const prevCompanyRef = useRef(company);

  useEffect(() => {
    const currentCompanyId = company?.id;
    const prevCompanyId = prevCompanyRef.current?.id;

    // If role changed and has an associated company, it takes precedence
    if (role?.id !== prevRoleRef.current?.id) {
      if (role?.company) {
        setValue('company' as Path<T>, role.company as PathValue<T, Path<T>>, {
          shouldValidate: true,
        });
      }
    }
    // If contact changed and has an associated company, only fill if company is currently empty
    else if (contact?.id !== prevContactRef.current?.id) {
      if (contact?.company && !company) {
        setValue('company' as Path<T>, contact.company as PathValue<T, Path<T>>, {
          shouldValidate: true,
        });
      }
    }
    // If company changed, clear the role if it doesn't match the new company
    else if (currentCompanyId !== prevCompanyId) {
      if (role && role.companyId !== currentCompanyId) {
        setValue('role' as Path<T>, null as PathValue<T, Path<T>>, { shouldValidate: true });
      }
    }

    prevContactRef.current = contact;
    prevRoleRef.current = role;
    prevCompanyRef.current = company;
  }, [contact, role, company, setValue]);

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

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- onSubmit with generic T doesn't perfectly match the expected SubmitHandler.
      onSubmit={handleSubmit(onSubmit as any)}
      className="px-12pt-6 mx-auto mb-4 max-w-md pb-32"
    >
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
                    setValue('direction' as Path<T>, inferredDirection as PathValue<T, Path<T>>, {
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
        <ErrorMsg name={'direction' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">{t('formSource')}</legend>
        <EnumSelector
          register={register('source' as Path<T>)}
          enumObject={SourceType}
          translationNamespace="SourceType"
        />
        <ErrorMsg name={'source' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formCompany')}</legend>
        <CompanyCombobox
          control={control}
          name={'company' as Path<T>}
          onSearch={onSearchCompany}
          placeholder={companyPlaceholder}
          createNewLabel={createCompanyLabel}
        />
        <ErrorMsg name={'company' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formContact')}</legend>
        <ContactCombobox
          control={control}
          name={'contact' as Path<T>}
          onSearch={onSearchContact}
          placeholder={contactPlaceholder}
          createNewLabel={createContactLabel}
          validateNewEntity={validateContact}
        />
        <ErrorMsg name={'contact.firstName' as Path<T>} errors={errors} tValidation={tValidation} />
        <ErrorMsg name={'contact.lastName' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formRole')}</legend>
        <RoleCombobox
          control={control}
          name={'role' as Path<T>}
          onSearch={(query) => onSearchRole(query, company?.id)}
          placeholder={rolePlaceholder}
          createNewLabel={createRoleLabel}
        />
        <ErrorMsg name={'title' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formDateOccurred')}</legend>
        <input
          type="date"
          className="input"
          {...register('occurredAt' as Path<T>, { valueAsDate: true })}
        />
        <ErrorMsg name={'occurredAt' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend flex items-center gap-2">
          {t('formSummary')}
          <EventSummaryGenerator
            eventTypeId={eventTypeId}
            eventTypes={eventTypes}
            role={role}
            company={company}
            contact={contact}
            currentSource={currentSource}
            currentDirection={currentDirection}
            setValue={setValue}
            autoGenerate={!isSummaryDirty || !summaryValue}
          />
        </legend>
        <input className="input" {...register('summary' as Path<T>)} />
        <ErrorMsg name={'summary' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formDetails')}</legend>
        <textarea className="textarea" {...register('details' as Path<T>)} />
        <ErrorMsg name={'details' as Path<T>} errors={errors} tValidation={tValidation} />
      </fieldset>

      <FloatingButtonContainer>
        <Link href={postActionRoute} className="btn btn-ghost">
          {tCommon('cancel')}
        </Link>
        <button className="btn btn-primary px-8" type="submit" disabled={isSubmitting}>
          {isEdit ? tCommon('update') : tCommon('create')}
        </button>
      </FloatingButtonContainer>
    </form>
  );
}

export default EventForm;
