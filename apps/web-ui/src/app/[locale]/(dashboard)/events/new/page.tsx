'use client';

import { useEffect, useRef, useState } from 'react';
import { FormProvider, Path, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { EntitySelection } from '@job-tracker/app-logic';
import { DirectionType, SourceType } from '@job-tracker/domain';
import {
  addBusinessDays,
  addDays,
  formatDateForInput,
  inferDirectionFromEventType,
  useAvailableActions,
  useCompany,
  useCompanySearch,
  useContactSearch,
  useContactWithCompany,
  useEventActions,
  useEventTypes,
  useRecentEventTypeIds,
  useRoleSearch,
  useRoleWithCompany,
} from '@job-tracker/hooks';
import {
  EventStepContext,
  EventStepDetails,
  EventStepReminder,
  EventStepType,
  FloatingButtonContainer,
} from '@job-tracker/ui-components';
import { EventCreateWithReminder, EventCreateWithReminderSchema } from '@job-tracker/validation';

import { useRouter } from '../../../../../i18n/routing';

export default function EventsNewPage() {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const tEvent = useTranslations('SystemEventTypes');
  const router = useRouter();
  const { eventTypes, loading: eventTypesLoading } = useEventTypes();
  const recentEventTypeIds = useRecentEventTypeIds();
  const { searchCompanies } = useCompanySearch();
  const { searchContacts } = useContactSearch();
  const { searchRoles } = useRoleSearch();
  const { upsertEvent } = useEventActions();
  const actions = useAvailableActions();

  const [step, setStep] = useState(1);
  const scrollPositions = useRef<Record<number, number>>({});
  const hasDefaulted = useRef(false);

  useEffect(() => {
    if (scrollPositions.current[step] !== undefined) {
      window.scrollTo(0, scrollPositions.current[step]);
    } else {
      window.scrollTo(0, 0);
    }
  }, [step]);

  const methods = useForm<EventCreateWithReminder>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(EventCreateWithReminderSchema as any),
    mode: 'onChange',
    defaultValues: {
      eventTypeId: '',
      direction: DirectionType.Inbound,
      source: SourceType.Email,
      occurredAt: formatDateForInput(new Date()) as unknown as Date,
      summary: '',
      details: '',
      company: null,
      contact: null,
      role: null,
      hasReminder: false,
      remindAt: formatDateForInput(addDays(new Date(), 1)) as unknown as Date,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    register,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  const searchParams = useSearchParams();
  const actionId = searchParams.get('action');
  const roleId = searchParams.get('roleId');
  const contactId = searchParams.get('contactId');
  const companyId = searchParams.get('companyId');

  const { role: contextRole } = useRoleWithCompany(roleId || '');
  const { contact: contextContact } = useContactWithCompany(contactId || '');
  const { company: contextCompany } = useCompany(companyId || '');

  useEffect(() => {
    if (hasDefaulted.current || eventTypes.length === 0) return;

    // Action from URL
    if (actionId) {
      const action = actions.find((a) => a.id === actionId);
      if (action) {
        const selectedType = eventTypes.find((t) => t.name === action.defaults.eventTypeName);
        if (selectedType) {
          setValue('eventTypeId', selectedType.id);
          setValue('direction', action.defaults.direction);
          setValue('source', action.defaults.source);

          if (action.defaults.suggestReminderDays) {
            const remindAt = addBusinessDays(new Date(), action.defaults.suggestReminderDays);
            setValue('hasReminder', true);
            setValue('remindAt', formatDateForInput(remindAt) as unknown as Date);
          }
          hasDefaulted.current = true;
          return;
        }
      }
    }

    // Most recent event type
    if (recentEventTypeIds.length > 0) {
      const mostRecentId = recentEventTypeIds[0];
      setValue('eventTypeId', mostRecentId);

      const selectedType = eventTypes.find((t) => t.id === mostRecentId);
      if (selectedType) {
        const inferredDirection = inferDirectionFromEventType(selectedType.name);
        if (inferredDirection) {
          setValue('direction', inferredDirection);
        }
      }
      hasDefaulted.current = true;
    }
  }, [actionId, eventTypes, recentEventTypeIds, setValue]);

  // Handle Context from URL
  useEffect(() => {
    if (contextRole) {
      const selection: EntitySelection = {
        ...contextRole,
        isNew: false,
        shouldRemove: false,
      };
      setValue('role', selection);
      if (contextRole.company) {
        setValue('company', {
          ...contextRole.company,
          isNew: false,
          shouldRemove: false,
        } as EntitySelection);
      }
    }
  }, [contextRole, setValue]);

  useEffect(() => {
    if (contextContact) {
      const selection: EntitySelection = {
        ...contextContact,
        isNew: false,
        shouldRemove: false,
      };
      setValue('contact', selection);
      if (contextContact.company) {
        setValue('company', {
          ...contextContact.company,
          isNew: false,
          shouldRemove: false,
        } as EntitySelection);
      }
    }
  }, [contextContact, setValue]);

  useEffect(() => {
    if (contextCompany) {
      setValue('company', {
        ...contextCompany,
        isNew: false,
        shouldRemove: false,
      } as EntitySelection);
    }
  }, [contextCompany, setValue]);

  // Watch all fields to ensure the component re-renders and canGoNext is reactive
  const formValues = watch();

  const selectedEventType = eventTypes.find((et) => et.id === formValues.eventTypeId);
  let selectedEventName = '';
  if (selectedEventType) {
    if (selectedEventType.isSystemDefined && selectedEventType.translationKey) {
      try {
        selectedEventName = tEvent(selectedEventType.translationKey);
      } catch {
        selectedEventName = selectedEventType.name;
      }
    } else {
      selectedEventName = selectedEventType.name;
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof EventCreateWithReminder)[] = [];
    if (step === 1) fieldsToValidate = ['eventTypeId'];
    if (step === 2) fieldsToValidate = ['company', 'contact', 'role'];
    if (step === 3) fieldsToValidate = ['direction', 'source', 'occurredAt'];

    const isStepValid = await trigger(fieldsToValidate as Path<EventCreateWithReminder>[]);
    if (isStepValid) {
      scrollPositions.current[step] = window.scrollY;
      setStep((s) => Math.min(s + 1, 4));
    }
  };
  const prevStep = () => {
    scrollPositions.current[step] = window.scrollY;
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: EventCreateWithReminder) => {
    // Prevent submission if not on the final step
    if (step < 4) {
      await nextStep();
      return;
    }

    try {
      const result = await upsertEvent(data);
      if (result.success) {
        router.push('/activity');
      }
    } catch (error) {
      console.error('Failed to create event', error);
    }
  };

  const canGoNext = () => {
    if (step === 1) return !!formValues.eventTypeId;
    if (step === 2) return true;
    if (step === 3) {
      return !!formValues.occurredAt && !!formValues.source && !!formValues.direction;
    }
    if (step === 4) {
      if (formValues.hasReminder) {
        return !!formValues.remindAt;
      }
      return true;
    }
    return true;
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-2xl pb-32">
        <h1 className="text-base-content mb-4 flex flex-wrap items-baseline text-3xl font-bold">
          <span className="whitespace-nowrap">{t('newTitle')}</span>
          {selectedEventName && (
            <span
              className="ml-2 max-w-[300px] truncate text-xl font-normal opacity-70"
              title={selectedEventName}
            >
              {selectedEventName}
            </span>
          )}
        </h1>

        <ul className="steps w-full">
          <li className={`step ${step >= 1 ? 'step-info' : ''}`}>{t('stepType')}</li>
          <li className={`step ${step >= 2 ? 'step-info' : ''}`}>{t('stepContext')}</li>
          <li className={`step ${step >= 3 ? 'step-info' : ''}`}>{t('stepDetails')}</li>
          <li className={`step ${step >= 4 ? 'step-info' : ''}`}>{t('stepReminder')}</li>
        </ul>

        <div className="card bg-base-100 border-base-200 mt-4 border shadow-xl">
          <div className="card-body min-h-[400px]">
            <form onSubmit={(e) => e.preventDefault()} className="flex h-full flex-col">
              <div className="flex-grow">
                {step === 1 && (
                  <EventStepType
                    eventTypes={eventTypes}
                    recentEventTypeIds={recentEventTypeIds}
                    loading={eventTypesLoading}
                    selectedTypeId={formValues.eventTypeId}
                    onSelect={(id) => {
                      setValue('eventTypeId', id, { shouldValidate: true });
                      const selectedType = eventTypes.find((t) => t.id === id);
                      if (selectedType) {
                        const inferredDirection = inferDirectionFromEventType(selectedType.name);
                        if (inferredDirection) {
                          setValue('direction', inferredDirection, { shouldValidate: true });
                        }
                      }
                    }}
                  />
                )}

                {step === 2 && (
                  <EventStepContext
                    control={control}
                    onSearchCompany={searchCompanies}
                    onSearchContact={searchContacts}
                    onSearchRole={searchRoles}
                    companyPlaceholder={t('formCompanyPlaceholder')}
                    contactPlaceholder={t('formContactPlaceholder')}
                    rolePlaceholder={t('formRolePlaceholder')}
                    createCompanyLabel={(name) => t('formCreateCompany', { name })}
                    createContactLabel={(firstNameLastName) =>
                      t('formCreateContact', { firstNameLastName })
                    }
                    createRoleLabel={(title) => t('formCreateRole', { title })}
                    validateContact={(input) => {
                      const trimmed = input.trim();
                      if (!trimmed) return null;
                      const parts = trimmed.split(/\s+/);
                      if (parts.length < 2) return t('formContactValidation');
                      return null;
                    }}
                  />
                )}
                {step === 3 && (
                  <EventStepDetails
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    eventTypes={eventTypes}
                  />
                )}
                {step === 4 && (
                  <EventStepReminder
                    register={register}
                    control={control}
                    setValue={setValue}
                    errors={errors}
                  />
                )}
              </div>

              <FloatingButtonContainer>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  {t('previous')}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => router.push('/activity')}
                  >
                    {tCommon('cancel')}
                  </button>
                  {step < 4 && (
                    <button
                      key="next-step-btn"
                      type="button"
                      className="btn btn-primary px-8"
                      onClick={async (e) => {
                        e.preventDefault();
                        await nextStep();
                      }}
                      disabled={!canGoNext()}
                    >
                      {t('next')}
                    </button>
                  )}
                  {step === 4 && (
                    <button
                      key="submit-event-btn"
                      type="button"
                      className="btn btn-success px-8"
                      disabled={!canGoNext() || isSubmitting}
                      onClick={async () => {
                        const isFormValid = await trigger();
                        if (isFormValid) {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          await handleSubmit(onSubmit as any)();
                        }
                      }}
                    >
                      {isSubmitting ? t('creating') : t('createEvent')}
                    </button>
                  )}
                </div>
              </FloatingButtonContainer>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
