'use client';

import CheckIcon from '@heroicons/react/24/solid/CheckIcon';

import { ContentCard } from '../common/data-display/content-card';

export interface FabPositionSelectorProps {
  value: 'left' | 'right';
  onChange: (value: 'left' | 'right') => void;
  disabled?: boolean;
  translations: {
    title: string;
    rightHanded: string;
    leftHanded: string;
  };
}

export function FabPositionSelector({
  value,
  onChange,
  disabled = false,
  translations,
}: FabPositionSelectorProps) {
  return (
    <ContentCard title={translations.title}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Right Handed Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('right')}
          className={`group relative flex w-full flex-col items-center rounded-xl border p-4 text-center transition-all duration-300 select-none sm:w-44 ${
            value === 'right'
              ? 'border-primary bg-primary/10 ring-primary/20 shadow-md ring-2'
              : 'border-base-content/20 bg-base-100 hover:border-primary/50 hover:bg-base-200/50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          {value === 'right' && (
            <div className="bg-primary text-primary-content animate-in zoom-in absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full p-0.5 shadow-sm duration-200">
              <CheckIcon className="h-4 w-4 stroke-[3]" />
            </div>
          )}
          {/* Mock Screen */}
          <div className="border-base-content/25 bg-base-100 relative flex h-20 w-28 flex-col justify-between overflow-hidden rounded-lg border p-2 shadow-inner">
            <div className="bg-base-200 flex h-2.5 w-full items-center justify-between rounded px-1">
              <div className="bg-base-content/30 h-1 w-4 rounded-full"></div>
              <div className="bg-base-content/20 h-2 w-2 rounded-full"></div>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1">
              <div className="bg-base-content/15 h-1 w-3/4 rounded"></div>
              <div className="bg-base-content/15 h-1 w-1/2 rounded"></div>
              <div className="bg-base-content/15 h-1 w-2/3 rounded"></div>
            </div>
            {/* Bottom Nav Bar */}
            <div className="bg-base-200 flex h-2 w-full items-center justify-around rounded-t px-1">
              <div className="bg-base-content/20 h-1.5 w-1.5 rounded-full"></div>
              <div className="bg-base-content/20 h-1.5 w-1.5 rounded-full"></div>
              <div className="bg-base-content/20 h-1.5 w-1.5 rounded-full"></div>
            </div>
            {/* FAB Dot */}
            <div className="bg-primary text-primary-content absolute right-2 bottom-3 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold shadow transition-transform duration-300 group-hover:scale-110">
              +
            </div>
          </div>
          <span className="text-base-content mt-3 text-sm font-semibold">
            {translations.rightHanded}
          </span>
        </button>

        {/* Left Handed Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('left')}
          className={`group relative flex w-full flex-col items-center rounded-xl border p-4 text-center transition-all duration-300 select-none sm:w-44 ${
            value === 'left'
              ? 'border-primary bg-primary/10 ring-primary/20 shadow-md ring-2'
              : 'border-base-content/20 bg-base-100 hover:border-primary/50 hover:bg-base-200/50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          {value === 'left' && (
            <div className="bg-primary text-primary-content animate-in zoom-in absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full p-0.5 shadow-sm duration-200">
              <CheckIcon className="h-4 w-4 stroke-[3]" />
            </div>
          )}
          {/* Mock Screen */}
          <div className="border-base-content/25 bg-base-100 relative flex h-20 w-28 flex-col justify-between overflow-hidden rounded-lg border p-2 shadow-inner">
            <div className="bg-base-200 flex h-2.5 w-full items-center justify-between rounded px-1">
              <div className="bg-base-content/30 h-1 w-4 rounded-full"></div>
              <div className="bg-base-content/20 h-2 w-2 rounded-full"></div>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1">
              <div className="bg-base-content/15 h-1 w-3/4 rounded"></div>
              <div className="bg-base-content/15 h-1 w-1/2 rounded"></div>
              <div className="bg-base-content/15 h-1 w-2/3 rounded"></div>
            </div>
            {/* Bottom Nav Bar */}
            <div className="bg-base-200 flex h-2 w-full items-center justify-around rounded-t px-1">
              <div className="bg-base-content/20 h-1.5 w-1.5 rounded-full"></div>
              <div className="bg-base-content/20 h-1.5 w-1.5 rounded-full"></div>
              <div className="bg-base-content/20 h-1.5 w-1.5 rounded-full"></div>
            </div>
            {/* FAB Dot */}
            <div className="bg-primary text-primary-content absolute bottom-3 left-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold shadow transition-transform duration-300 group-hover:scale-110">
              +
            </div>
          </div>
          <span className="text-base-content mt-3 text-sm font-semibold">
            {translations.leftHanded}
          </span>
        </button>
      </div>
    </ContentCard>
  );
}

export default FabPositionSelector;
