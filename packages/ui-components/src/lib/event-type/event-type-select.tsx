'use client';

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
        <option value="">{isLoading ? 'Loading event types...' : 'Select an event type'}</option>

        {options.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      {isLoading && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <span className="loading loading-bars loading-xs text-primary"></span>
        </div>
      )}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default EventTypeSelect;
