'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EventTypeDTO } from '@job-tracker/validation';

import PageLoading from '../../common/page-loading';

export interface EventStepTypesProps {
  eventTypes: EventTypeDTO[];
  recentEventTypeIds: string[];
  loading: boolean;
  selectedTypeId?: string | null;
  onSelect: (typeId: string) => void;
}

export function EventStepType({
  eventTypes,
  recentEventTypeIds,
  loading,
  selectedTypeId,
  onSelect,
}: EventStepTypesProps) {
  const t = useTranslations('Events');
  const tEnum = useTranslations('Enums');
  const tEvent = useTranslations('SystemEventTypes');

  const ALL_KEY = 'All';
  const RECENT_KEY = 'Recent';

  // Group the data
  const groupedCategories = useMemo(() => {
    if (!eventTypes || eventTypes.length === 0) return {} as Record<string, EventTypeDTO[]>;

    const groups = eventTypes.reduce(
      (acc, item) => {
        (acc[item.category] ??= []).push(item);
        return acc;
      },
      {} as Record<string, EventTypeDTO[]>,
    );

    const result: Record<string, EventTypeDTO[]> = { [ALL_KEY]: eventTypes };

    if (recentEventTypeIds && recentEventTypeIds.length > 0) {
      const recentTypes = recentEventTypeIds
        .map((id) => eventTypes.find((et) => et.id === id))
        .filter((et): et is EventTypeDTO => !!et);

      if (recentTypes.length > 0) {
        result[RECENT_KEY] = recentTypes;
      }
    }

    return { ...result, ...groups };
  }, [eventTypes, recentEventTypeIds]);

  // Sort categories ('All' at the start, 'Recent' at the end)
  const categoryKeys = useMemo(() => {
    return Object.keys(groupedCategories).sort((a, b) => {
      if (a === ALL_KEY) return -1;
      if (b === ALL_KEY) return 1;
      if (a === RECENT_KEY) return 1;
      if (b === RECENT_KEY) return -1;
      return a.localeCompare(b);
    });
  }, [groupedCategories]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeCategory = useMemo(() => {
    if (selectedCategory && groupedCategories[selectedCategory]) {
      return selectedCategory;
    }

    if (selectedTypeId) {
      const type = eventTypes.find((et) => et.id === selectedTypeId);
      if (type && groupedCategories[type.category]) {
        return type.category;
      }
    }

    return ALL_KEY;
  }, [selectedCategory, groupedCategories, selectedTypeId, eventTypes]);

  const getCategoryLabel = (cat: string) => {
    if (cat === ALL_KEY) return tEnum('all');
    if (cat === RECENT_KEY) return tEnum('recent');
    return tEnum(`EventCategoryType.${cat}`);
  };

  const getEventName = (type: EventTypeDTO) => {
    if (type.isSystemDefined) {
      try {
        return tEvent(type.name);
      } catch (e) {
        return type.name;
      }
    }
    return type.name;
  };

  return (
    <div className="space-y-4">
      {loading && <PageLoading entityName={t('formEventType')}></PageLoading>}

      <h2 className="text-base-content text-lg font-semibold">{t('whatKindEvent')}</h2>

      {categoryKeys.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`badge ${activeCategory === cat ? 'badge-primary' : 'badge-ghost'}`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      )}

      <h2 className="text-base-content text-lg font-semibold">{t('selectEventType')}</h2>

      <div className="grid w-full grid-cols-2 gap-3">
        {groupedCategories[activeCategory]?.map((eventType) => (
          <button
            type="button"
            key={eventType.id}
            onClick={() => onSelect(eventType.id)}
            className={`btn btn-small btn-soft h-16 leading-tight ${selectedTypeId === eventType.id ? 'btn-secondary' : 'btn-ghost'}`}
          >
            {getEventName(eventType)}
          </button>
        ))}
        {!loading && categoryKeys.length === 0 && (
          <p className="px-1 text-sm italic opacity-50">{t('noEventTypesFound')}</p>
        )}
      </div>
    </div>
  );
}

export default EventStepType;
