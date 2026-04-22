'use client';

import { EventTypeDTO } from '@job-tracker/validation';
import { useState, useMemo } from 'react';
import PageLoading from '../../common/page-loading';

export interface EventStepTypesProps {
  eventTypes: EventTypeDTO[];
  loading: boolean;
  selectedTypeId?: string | null;
  onSelect: (typeId: string) => void;
}

export function EventStepType({
  eventTypes,
  loading,
  selectedTypeId,
  onSelect,
}: EventStepTypesProps) {
  const ALL_KEY = 'All';

  // Group the data
  const groupedCategories = useMemo(() => {
    if (!eventTypes || eventTypes.length === 0) return {} as Record<string, EventTypeDTO[]>;

    const counts = eventTypes.reduce(
      (acc, { category }) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const groups = eventTypes.reduce(
      (acc, item) => {
        // Only add to specific category group if it has > 1 entry
        if (counts[item.category] > 1) {
          (acc[item.category] ??= []).push(item);
        }
        return acc;
      },
      {} as Record<string, EventTypeDTO[]>,
    );

    // Spread the groups after "All" so "All" is naturally first in the object keys
    return { [ALL_KEY]: eventTypes, ...groups };
  }, [eventTypes]);

  // Sort categories ('All' at the start)
  const categoryKeys = useMemo(() => {
    return Object.keys(groupedCategories).sort((a, b) => {
      if (a === ALL_KEY) return -1;
      if (b === ALL_KEY) return 1;
      return a.localeCompare(b);
    });
  }, [groupedCategories]);

  // Default to ALL_KEY immediately to ensure it's the primary view
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_KEY);

  const activeCategory = useMemo(() => {
    // If selection is valid, use it; otherwise, default to 'All' or first available
    if (selectedCategory && groupedCategories[selectedCategory]) {
      return selectedCategory;
    }
    return categoryKeys[0] || ALL_KEY;
  }, [selectedCategory, groupedCategories, categoryKeys]);

  return (
    <div className="space-y-4">
      {loading && <PageLoading entityName={'Event Types'}></PageLoading>}

      <h2 className="text-base-content text-lg font-semibold">What kind of event is this?</h2>

      {categoryKeys.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`badge ${activeCategory === cat ? 'badge-primary' : 'badge-ghost'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <h2 className="text-base-content text-lg font-semibold">Select an event type</h2>

      <div className="grid w-full grid-cols-2 gap-3">
        {groupedCategories[activeCategory]?.map((eventType) => (
          <button
            type="button"
            key={eventType.id}
            onClick={() => onSelect(eventType.id)}
            className={`btn btn-small btn-soft h-16 leading-tight ${selectedTypeId === eventType.id ? 'btn-secondary' : 'btn-ghost'}`}
          >
            {eventType.name}
          </button>
        ))}
        {!loading && categoryKeys.length === 0 && (
          <p className="px-1 text-sm italic opacity-50">No Event Types found</p>
        )}
      </div>
    </div>
  );
}

export default EventStepType;
