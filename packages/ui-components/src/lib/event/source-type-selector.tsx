'use client';

import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { SourceTypeDTO } from '@job-tracker/validation';

export interface SourceTypeSelectorProps {
  sourceTypes: SourceTypeDTO[];
  loading: boolean;
  form: UseFormReturn<any>;
  sourceTypeIdField: string;
  sourceCustomNameField: string;
}

export function SourceTypeSelector({
  sourceTypes,
  loading,
  form,
  sourceTypeIdField,
  sourceCustomNameField,
}: SourceTypeSelectorProps) {
  const t = useTranslations('Events');
  const tEnum = useTranslations('Enums');

  const { register, watch, setValue } = form;

  const currentSourceTypeId = watch(sourceTypeIdField);
  const currentSourceCustomName = watch(sourceCustomNameField);

  const systemSources = useMemo(
    () => sourceTypes.filter((st) => st.isSystemDefined),
    [sourceTypes],
  );

  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Sync isOtherSelected with form state on initial load/change
  useEffect(() => {
    if (currentSourceTypeId) {
      const source = sourceTypes.find((st) => st.id === currentSourceTypeId);
      if (source && !source.isSystemDefined) {
        setIsOtherSelected(true);
        setValue(sourceCustomNameField, source.name);
      } else {
        setIsOtherSelected(false);
      }
    } else if (currentSourceCustomName) {
      setIsOtherSelected(true);
    }
  }, [currentSourceTypeId, sourceTypes, setValue, sourceCustomNameField, currentSourceCustomName]);

  const handleSourceSelect = (id: string) => {
    setValue(sourceTypeIdField, id);
    setValue(sourceCustomNameField, '');
    setIsOtherSelected(false);
  };

  const handleOtherSelect = () => {
    setValue(sourceTypeIdField, '');
    setIsOtherSelected(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {systemSources.map((source) => (
          <button
            key={source.id}
            type="button"
            onClick={() => handleSourceSelect(source.id)}
            className={`btn btn-sm btn-soft ${
              currentSourceTypeId === source.id ? 'btn-secondary' : 'btn-ghost'
            }`}
          >
            {tEnum(`SourceType.${source.name}`)}
          </button>
        ))}
        <button
          type="button"
          onClick={handleOtherSelect}
          className={`btn btn-sm btn-soft ${isOtherSelected ? 'btn-secondary' : 'btn-ghost'}`}
        >
          {tEnum('SourceType.Other')}
        </button>
      </div>

      {isOtherSelected && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            {...register(sourceCustomNameField)}
            type="text"
            placeholder={t('customSourcePlaceholder')}
            className="input input-bordered w-full"
          />
        </div>
      )}
    </div>
  );
}

export default SourceTypeSelector;
