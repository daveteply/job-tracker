'use client';

import {
  useCompanySearch,
  useContactSearch,
  useEventActions,
  useEventTypes,
  useRoleSearch,
} from '@job-tracker/hooks';
import {
  EventStepContext,
  EventStepDetails,
  EventStepReminder,
  EventStepType,
  FloatingButtonContainer,
} from '@job-tracker/ui-components';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventCreateWithReminderSchema, EventCreateWithReminder } from '@job-tracker/validation';
import { DirectionType, SourceType } from '@job-tracker/domain';
import { useRouter } from 'next/navigation';

export default function EventsNewPage() {
  const router = useRouter();
  const { eventTypes, loading: eventTypesLoading } = useEventTypes();
  const { searchCompanies } = useCompanySearch();
  const { searchContacts } = useContactSearch();
  const { searchRoles } = useRoleSearch();
  const { upsertEvent } = useEventActions();

  const [step, setStep] = useState(1);

  const methods = useForm<EventCreateWithReminder>({
    resolver: zodResolver(EventCreateWithReminderSchema) as any,
    mode: 'onChange',
    defaultValues: {
      eventTypeId: '',
      direction: DirectionType.Inbound,
      source: SourceType.Email,
      occurredAt: new Date(),
      summary: '',
      details: '',
      hasReminder: false,
      remindAt: undefined,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    register,
    formState: { isValid, isSubmitting, errors },
  } = methods;

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const selectedTypeId = watch('eventTypeId');

  const onSubmit = async (data: EventCreateWithReminder) => {
    // Prevent submission if not on the final step
    if (step < 4) {
      nextStep();
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
    if (step === 1) return !!selectedTypeId;
    return true;
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto pb-32">
        <h1 className="text-3xl font-bold mb-4 text-base-content">New Event</h1>

        <ul className="steps w-full">
          <li className={`step ${step >= 1 ? 'step-info' : ''}`}>Type</li>
          <li className={`step ${step >= 2 ? 'step-info' : ''}`}>Context</li>
          <li className={`step ${step >= 3 ? 'step-info' : ''}`}>Details</li>
          <li className={`step ${step >= 4 ? 'step-info' : ''}`}>Reminder</li>
        </ul>

        <div className="card bg-base-100 shadow-xl border border-base-200 mt-4">
          <div className="card-body min-h-[400px]">
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
              <div className="flex-grow">
                {step === 1 && (
                  <EventStepType
                    eventTypes={eventTypes}
                    loading={eventTypesLoading}
                    selectedTypeId={selectedTypeId}
                    onSelect={(id) => {
                      setValue('eventTypeId', id, { shouldValidate: true });
                    }}
                  />
                )}

                {step === 2 && (
                  <EventStepContext
                    control={control}
                    onSearchCompany={searchCompanies}
                    onSearchContact={searchContacts}
                    onSearchRole={searchRoles}
                  />
                )}
                {step === 3 && <EventStepDetails register={register} />}
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
                  Previous
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => router.push('/activity')}
                  >
                    Cancel
                  </button>
                  {step < 4 && (
                    <button
                      key="next-step-btn"
                      type="button"
                      className="btn btn-primary px-8"
                      onClick={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                      disabled={!canGoNext()}
                    >
                      Next
                    </button>
                  )}
                  {step === 4 && (
                    <button
                      key="submit-event-btn"
                      type="submit"
                      className="btn btn-success px-8"
                      disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Event'}
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
