'use client';

import {
  useWatch,
  FieldValues,
  Path,
  UseFormRegister,
  Control,
  UseFormSetValue,
  FieldErrors,
} from 'react-hook-form';
import { useEffect } from 'react';

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
  const hasReminder = useWatch({
    control,
    name: 'hasReminder' as Path<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue: false as any,
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
      setValue('remindAt' as Path<T>, formattedDate as any, {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue('remindAt' as Path<T>, formattedDate as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base-content text-lg font-semibold">Follow-up Reminder</h2>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('hasReminder' as Path<T>)}
          />
          <span className="label-text text-base-content font-medium">
            Create a follow-up reminder?
          </span>
        </label>
      </div>

      {hasReminder && (
        <div className="form-control animate-in fade-in slide-in-from-top-2 max-w-sm duration-300">
          <label className="label">
            <span className="label-text text-base-content font-medium">Remind me on</span>
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
              5 Business Days
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary"
              onClick={() => setReminderDate(10, true)}
            >
              10 Business Days
            </button>
          </div>
          {errors?.remindAt && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.remindAt.message as string}</span>
            </label>
          )}
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              We'll add this to your tasks.
            </span>
          </label>
        </div>
      )}

      {!hasReminder && (
        <div className="text-base-content/50 italic">
          No reminder will be created. You can always add one later.
        </div>
      )}
    </div>
  );
}

export default EventStepReminder;
