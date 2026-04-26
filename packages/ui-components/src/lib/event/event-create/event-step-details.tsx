'use client';

import { FieldValues, Path, PathValue, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { DirectionType, SourceType } from '@job-tracker/domain';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Events');
  const tEnum = useTranslations('Enums');

  const currentSource = watch('source' as Path<T>);
  const currentDirection = watch('direction' as Path<T>);

  return (
    <div className="space-y-6">
      <h2 className="text-base-content text-lg font-semibold">{t('detailsTitle')}</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content font-medium">{t('formDirection')}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(DirectionType).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setValue('direction' as Path<T>, value as PathValue<T, Path<T>>, { shouldValidate: true })
                }
                className={`badge ${currentDirection === value ? 'badge-primary' : 'badge-ghost'}`}
              >
                {tEnum(`DirectionType.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content font-medium">{t('formSource')}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SourceType).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setValue('source' as Path<T>, value as PathValue<T, Path<T>>, { shouldValidate: true })
                }
                className={`badge ${currentSource === value ? 'badge-primary' : 'badge-ghost'}`}
              >
                {tEnum(`SourceType.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-control max-w-xs">
        <label className="label">
          <span className="label-text text-base-content font-medium">{t('formDateOccurred')}</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          {...register('occurredAt' as Path<T>)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content font-medium">{t('formSummary')}</span>
        </label>
        <input
          className="input input-bordered w-full"
          {...register('summary' as Path<T>)}
          placeholder={t('formSummaryPlaceholder', { defaultValue: 'e.g. Phone screen with Recruiter' })}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content font-medium">{t('formDetails')}</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-32 w-full"
          {...register('details' as Path<T>)}
          placeholder={t('formDetailsPlaceholder', { defaultValue: 'Add any extra details...' })}
        />
      </div>
    </div>
  );
}

export default EventStepDetails;
