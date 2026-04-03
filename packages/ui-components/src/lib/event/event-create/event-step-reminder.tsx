'use client';

import { UseFormRegister, useWatch, Control, FieldErrors, UseFormSetValue } from 'react-hook-form';

export interface EventStepReminderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<any>;
}

export function EventStepReminder({ register, control, setValue, errors }: EventStepReminderProps) {
  const hasReminder = useWatch({
    control,
    name: 'hasReminder',
    defaultValue: false,
  });

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

    setValue('remindAt', formattedDate, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-base-content">Follow-up Reminder</h2>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('hasReminder')}
          />
          <span className="label-text font-medium text-base-content">
            Create a follow-up reminder?
          </span>
        </label>
      </div>

      {hasReminder && (
        <div className="form-control max-w-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="label">
            <span className="label-text font-medium text-base-content">Remind me on</span>
          </label>
          <input
            type="date"
            className={`input input-bordered w-full ${errors?.remindAt ? 'input-error' : ''}`}
            {...register('remindAt', { valueAsDate: true })}
          />
          <div className="flex flex-wrap gap-2 mt-3">
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
