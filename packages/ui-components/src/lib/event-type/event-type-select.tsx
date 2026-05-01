'use client';

import { useTranslations } from 'next-intl';

import { EventTypeDTO } from '@job-tracker/validation';

interface EventTypeSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  options: EventTypeDTO[];
  error?: string;
  required?: boolean;
  isLoading?: boolean;
}

export function EventTypeSelect({
  value,
  onChange,
  options,
  error,
  required = false,
  isLoading = false,
}: EventTypeSelectProps) {
  const t = useTranslations('SystemEventTypes');
  const tCommon = useTranslations('Enums'); // Reusing for 'Select an event type' logic if needed, but let's see

  const getLabel = (type: EventTypeDTO) => {
    if (type.isSystemDefined && type.translationKey) {
      try {
        return t(type.translationKey);
      } catch (e) {
        return type.name;
      }
    }
    return type.name;
  };

  return (
    <div className="relative w-full">
      <select
        className={`select w-full ${error ? 'select-error' : ''}`}
        required={required}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          // If user selects the placeholder, send undefined/null to satisfy Zod .nullable()
          onChange(val === '' ? undefined : val);
        }}
      >
        <option value="">
          {isLoading ? t('loading', { defaultValue: 'Loading...' }) : tCommon('selectOption')}
        </option>

        {options.map((type) => (
          <option key={type.id} value={type.id}>
            {getLabel(type)}
          </option>
        ))}
      </select>

      {isLoading && (
        <div className="absolute top-1/2 right-10 -translate-y-1/2">
          <span className="loading loading-bars loading-xs text-primary"></span>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default EventTypeSelect;
