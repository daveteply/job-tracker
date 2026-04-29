'use client';

import { useCallback, useEffect } from 'react';
import { FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form';

import { InformationCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { CompanyDTO, EventTypeDTO, RoleDTO } from '@job-tracker/validation';

export interface EventSummaryGeneratorProps<T extends FieldValues = FieldValues> {
  eventTypeId: string | null;
  eventTypes?: EventTypeDTO[];
  role: RoleDTO | null;
  company: CompanyDTO | null;
  currentSource: string;
  setValue: UseFormSetValue<T>;
  autoGenerate?: boolean;
  onGenerate?: (summary: string) => void;
}

export function EventSummaryGenerator<T extends FieldValues = FieldValues>({
  eventTypeId,
  eventTypes,
  role,
  company,
  currentSource,
  setValue,
  autoGenerate = false,
  onGenerate,
}: EventSummaryGeneratorProps<T>) {
  const t = useTranslations('Events');
  const tEnum = useTranslations('Enums');
  const tEvent = useTranslations('SystemEventTypes');

  const calculateSummary = useCallback(() => {
    const selectedType = eventTypes?.find((et) => et.id === eventTypeId);
    if (!selectedType) return '';

    let eventTypeName = selectedType.name;
    if (selectedType.isSystemDefined) {
      try {
        eventTypeName = tEvent(selectedType.name);
      } catch (e) {
        // Fallback to name
      }
    }

    const roleTitle = role?.title;
    const companyName = company?.name;
    const sourceLabel = currentSource ? tEnum(`SourceType.${currentSource as string}`) : '';

    let summary = eventTypeName;

    if (roleTitle) {
      summary += ` ${t('to')} ${roleTitle}`;
    }

    if (companyName) {
      summary += ` ${t('at')} ${companyName}`;
    }

    if (sourceLabel) {
      summary += ` ${t('via')} ${sourceLabel}`;
    }

    return summary;
  }, [eventTypeId, eventTypes, role, company, currentSource, t, tEnum, tEvent]);

  const generateSummary = useCallback(
    (shouldDirty = true) => {
      const summary = calculateSummary();
      if (!summary) return;

      setValue('summary' as Path<T>, summary as PathValue<T, Path<T>>, {
        shouldValidate: true,
        shouldDirty,
      });

      onGenerate?.(summary);
    },
    [calculateSummary, setValue, onGenerate],
  );

  useEffect(() => {
    if (autoGenerate && eventTypeId) {
      generateSummary(false);
    }
  }, [autoGenerate, eventTypeId, generateSummary]);

  const canGenerate = !!eventTypeId && (!!role || !!company || !!currentSource);

  if (!canGenerate) return null;

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => generateSummary(true)}
        className="btn btn-ghost btn-xs text-primary flex items-center gap-1 normal-case"
      >
        <LightBulbIcon className="h-4 w-4" />
      </button>
      <div
        className="tooltip tooltip-above before:max-w-[200px] before:whitespace-normal"
        data-tip={t('generateSummaryTooltip')}
      >
        <InformationCircleIcon className="text-base-content/50 h-5 w-5 cursor-help" />
      </div>
    </div>
  );
}

export default EventSummaryGenerator;
