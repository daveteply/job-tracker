'use client';

import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { DirectionType, SourceType } from '@job-tracker/domain';
import { EnumSelector } from '../../common/enum-selector';

export interface EventStepDetailsProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
}

export function EventStepDetails<T extends FieldValues = FieldValues>({
  register,
}: EventStepDetailsProps<T>) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-base-content">Event Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content">Direction</span>
          </label>
          <EnumSelector
            register={register('direction' as Path<T>)}
            enumObject={DirectionType}
            useButtons={true}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content">Source</span>
          </label>
          <EnumSelector register={register('source' as Path<T>)} enumObject={SourceType} />
        </div>
      </div>

      <div className="form-control max-w-xs">
        <label className="label">
          <span className="label-text font-medium text-base-content">Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          {...register('occurredAt' as Path<T>, { valueAsDate: true })}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content">Summary</span>
        </label>
        <input
          className="input input-bordered w-full"
          {...register('summary' as Path<T>)}
          placeholder="e.g. Phone screen with Recruiter"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content">Notes (Optional)</span>
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
