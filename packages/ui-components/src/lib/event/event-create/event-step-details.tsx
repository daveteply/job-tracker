'use client';

import { UseFormRegister } from 'react-hook-form';
import { DirectionType, SourceType } from '@job-tracker/domain';
import { EnumSelector } from '../../common/enum-selector';

export interface EventStepDetailsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export function EventStepDetails({ register }: EventStepDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-base-content">Event Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content">Direction</span>
          </label>
          <EnumSelector
            register={register('direction')}
            enumObject={DirectionType}
            useButtons={true}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-base-content">Source</span>
          </label>
          <EnumSelector register={register('source')} enumObject={SourceType} />
        </div>
      </div>

      <div className="form-control max-w-xs">
        <label className="label">
          <span className="label-text font-medium text-base-content">Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          {...register('occurredAt', { valueAsDate: true })}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content">Summary</span>
        </label>
        <input
          className="input input-bordered w-full"
          {...register('summary')}
          placeholder="e.g. Phone screen with Recruiter"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content">Notes (Optional)</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-32 w-full"
          {...register('details')}
          placeholder="Add any extra details..."
        />
      </div>
    </div>
  );
}

export default EventStepDetails;
