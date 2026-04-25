'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReminderInputSchema, ReminderUpdateSchema } from '@job-tracker/validation';
import { useToast } from '../common/toast-context';
import Link from 'next/link';
import { FloatingButtonContainer } from '../common/floating-button-container';
import { useTranslations } from 'next-intl';

interface ReminderFormProps<T extends FieldValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  postActionRoute: string;
}

export function ReminderForm<T extends FieldValues>({
  onSubmitAction,
  initialData,
  isEdit = false,
  postActionRoute,
}: ReminderFormProps<T>) {
  const t = useTranslations('Reminders');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? ReminderUpdateSchema : ReminderInputSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: T) => {
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

  const ErrorMsg = ({ name }: { name: Path<T> }) => {
    const error = errors[name];
    if (!error || !error.message) return null;
    return (
      <p className="text-red-600">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <span>{tValidation(error.message.toString() as any)}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 mx-auto mb-4 max-w-md pb-8">
      {!isEdit && (
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t('formEvent')}</legend>
          <input className="input" {...register('eventId' as Path<T>)} placeholder="Event ID" />
          <p className="label">{tCommon('required')}</p>
          <ErrorMsg name={'eventId' as Path<T>} />
        </fieldset>
      )}

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formRemindAt')}</legend>
        <input 
          className="input" 
          type="date" 
          {...register('remindAt' as Path<T>)} 
        />
        <p className="label">{tCommon('required')}</p>
        <ErrorMsg name={'remindAt' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formCompletedAt')}</legend>
        <input 
          className="input" 
          type="date" 
          {...register('completedAt' as Path<T>)} 
        />
        <ErrorMsg name={'completedAt' as Path<T>} />
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
