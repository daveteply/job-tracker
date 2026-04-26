'use client';

import { useEffect } from 'react';
import { DefaultValues, Path, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { ReminderInput, ReminderInputSchema, ReminderUpdateSchema } from '@job-tracker/validation';

import { FloatingButtonContainer } from '../common/floating-button-container';
import { useToast } from '../common/toast-context';

interface ReminderFormProps {
  onSubmitAction: (data: ReminderInput) => Promise<{ success: boolean; message: string }>;
  initialData?: DefaultValues<ReminderInput>;
  isEdit?: boolean;
  postActionRoute: string;
}

const formatToYYYYMMDD = (date: unknown): string => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date as string | number);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

export function ReminderForm({
  onSubmitAction,
  initialData,
  isEdit = false,
  postActionRoute,
}: ReminderFormProps) {
  const t = useTranslations('Reminders');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? ReminderUpdateSchema : ReminderInputSchema;

  const getFormattedValues = (
    data?: DefaultValues<ReminderInput>,
  ): DefaultValues<ReminderInput> | undefined => {
    if (!data) return undefined;
    const record = data as Record<string, unknown>;
    return {
      ...data,
      remindAt: formatToYYYYMMDD(record.remindAt),
      completedAt: formatToYYYYMMDD(record.completedAt),
    } as unknown as DefaultValues<ReminderInput>;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReminderInput>({
    resolver: zodResolver(schema as any),
    defaultValues: getFormattedValues(initialData),
  });

  // Reset form when initialData changes - use a stable JSON string as dependency
  const initialDataJSON = JSON.stringify(initialData);
  useEffect(() => {
    if (initialData) {
      reset(getFormattedValues(initialData));
    }
  }, [initialData, initialDataJSON, reset]);

  const onSubmit = async (data: ReminderInput) => {
    try {
      const result = await onSubmitAction(data);
      if (result.success) {
        showToast(`Reminder ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push(postActionRoute);
      } else {
        showToast(result.message || 'Could not save Reminder', 'error');
      }
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  const ErrorMsg = ({ name }: { name: Path<ReminderInput> }) => {
    const error = errors[name];
    if (!error || !error.message) return null;
    return (
      <p className="text-red-600">
        <span>{tValidation(error.message.toString() as any)}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="px-12pt-6 mx-auto mb-4 max-w-md pb-8">
      <input type="hidden" {...register('id')} />
      <input type="hidden" {...register('eventId')} />

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formRemindAt')}</legend>
        <input
          className="input"
          type="date"
          min={formatToYYYYMMDD(new Date())}
          {...register('remindAt')}
        />
        <p className="label">{tCommon('required')}</p>
        <ErrorMsg name="remindAt" />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formCompletedAt')}</legend>
        <input className="input" type="date" {...register('completedAt')} />
        <ErrorMsg name="completedAt" />
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

export default ReminderForm;
