'use client';

import {
  useWatch,
  FieldValues,
  Path,
  UseFormRegister,
  Control,
  UseFormSetValue,
  FieldErrors,
  PathValue,
} from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export interface EventStepReminderProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  errors?: FieldErrors<T>;
}

export function EventStepReminder<T extends FieldValues = FieldValues>({
  register,
  control,
  setValue,
  errors,
}: EventStepReminderProps<T>) {
  const t = useTranslations('Events');
  const hasReminder = useWatch({
    control,
    name: 'hasReminder' as Path<T>,
    defaultValue: false as PathValue<T, Path<T>>,
  });

  const remindAt = useWatch({
    control,
    name: 'remindAt' as Path<T>,
  });

  useEffect(() => {
    if (hasReminder && !remindAt) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dayOfMonth = String(tomorrow.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayOfMonth}`;
      setValue('remindAt' as Path<T>, formattedDate as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }
  }, [hasReminder, remindAt, setValue]);

  const setReminderDate = (days: number, isBusinessDays = false) => {
    const date = new Date();
    if (isBusinessDays) {
      let count = 0;
      while (count < days) {
        date.setDate(date.getDate() + 1);
        const day = date.getDay();
        if (day !== 0 && day !== 6) {
          count++;
        }
      }
    } else {
      date.setDate(date.getDate() + days);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayOfMonth}`;

    setValue('remindAt' as Path<T>, formattedDate as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base-content text-lg font-semibold">{t('reminderTitle')}</h2>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('hasReminder' as Path<T>)}
          />
          <span className="label-text text-base-content font-medium">
            {t('createReminder')}
          </span>
        </label>
      </div>

      {hasReminder && (
        <div className="form-control animate-in fade-in slide-in-from-top-2 max-w-sm duration-300">
          <label className="label">
            <span className="label-text text-base-content font-medium">{t('remindMeOn')}</span>
          </label>
          <input
            type="date"
            className={`input input-bordered w-full ${errors?.remindAt ? 'input-error' : ''}`}
            {...register('remindAt' as Path<T>)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary"
              onClick={() => setReminderDate(5, true)}
            >
              {t('fiveBusinessDays')}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary"
              onClick={() => setReminderDate(10, true)}
            >
              {t('tenBusinessDays')}
            </button>
          </div>
          {errors?.remindAt && (
            <label className="label">
              <span className="label-text-alt text-error">
                {t(errors.remindAt.message as Parameters<typeof t>[0])}
              </span>
            </label>
          )}
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              {t('reminderTasksNote')}
            </span>
          </label>
        </div>
      )}

      {!hasReminder && (
        <div className="text-base-content/50 italic">
          {t('noReminderNote')}
        </div>
      )}
    </div>
  );
}

export default EventStepReminder;
