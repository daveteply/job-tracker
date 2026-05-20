'use client';

import ArrowsPointingInIcon from '@heroicons/react/24/outline/ArrowsPointingInIcon';
import ArrowsPointingOutIcon from '@heroicons/react/24/outline/ArrowsPointingOutIcon';
import { useTranslations } from 'next-intl';

export interface EventListExpandToggleProps {
  showFull: boolean;
  onToggleShowFull: () => void;
}

export function EventListExpandToggle({ showFull, onToggleShowFull }: EventListExpandToggleProps) {
  const t = useTranslations('Events');

  return (
    <label className="swap text-xs font-medium uppercase opacity-70 transition-opacity hover:opacity-100">
      <input
        type="checkbox"
        checked={showFull}
        onChange={() => onToggleShowFull()}
        className="hidden"
      />
      <div className="swap-on flex items-center justify-end gap-1">
        <ArrowsPointingInIcon className="h-4 w-4" />
        <span>{t('collapse')}</span>
      </div>
      <div className="swap-off flex items-center justify-end gap-1">
        <ArrowsPointingOutIcon className="h-4 w-4" />
        <span>{t('expand')}</span>
      </div>
    </label>
  );
}

export default EventListExpandToggle;
