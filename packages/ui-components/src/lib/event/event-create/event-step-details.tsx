'use client';

import { FieldValues, Path, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { DirectionType, SourceType } from '@job-tracker/domain';

export interface EventStepDetailsProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
}

export function EventStepDetails<T extends FieldValues = FieldValues>({
  register,
  watch,
  setValue,
}: EventStepDetailsProps<T>) {
  const currentSource = watch('source' as Path<T>);
  const currentDirection = watch('direction' as Path<T>);

  return (
    <div className="space-y-6">
      <h2 className="text-base-content text-lg font-semibold">Event Details</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content font-medium">Direction</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(DirectionType).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setValue('direction' as Path<T>, value as any, { shouldValidate: true })
                }
                className={`badge ${currentDirection === value ? 'badge-primary' : 'badge-ghost'}`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content font-medium">Source</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SourceType).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setValue('source' as Path<T>, value as any, { shouldValidate: true })
                }
                className={`badge ${currentSource === value ? 'badge-primary' : 'badge-ghost'}`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-control max-w-xs">
        <label className="label">
          <span className="label-text text-base-content font-medium">Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          {...register('occurredAt' as Path<T>)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content font-medium">Summary (Optional)</span>
        </label>
        <input
          className="input input-bordered w-full"
          {...register('summary' as Path<T>)}
          placeholder="e.g. Phone screen with Recruiter"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content font-medium">Notes (Optional)</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-32 w-full"
          {...register('details' as Path<T>)}
          placeholder="Add any extra details..."
        />
      </div>
    </div>
  );
}

export default EventStepDetails;
