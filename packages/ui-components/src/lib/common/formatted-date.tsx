'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export interface FormattedDateProps {
  dateValue?: Date | string;
  useRelativeTime?: boolean;
}

export function FormattedDate({ dateValue, useRelativeTime = true }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !dateValue) return null;

  let eventYear: number;
  let eventMonth: number;
  let eventDay: number;

  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [y, m, d] = dateValue.split('-').map(Number);
    eventYear = y;
    eventMonth = m - 1;
    eventDay = d;
  } else {
    const d = new Date(dateValue);
    // Heuristic: If it's exactly UTC midnight, it's likely a date-only value
    // from a database or a date picker that was coerced/saved as UTC.
    if (
      d.getUTCHours() === 0 &&
      d.getUTCMinutes() === 0 &&
      d.getUTCSeconds() === 0 &&
      d.getUTCMilliseconds() === 0
    ) {
      eventYear = d.getUTCFullYear();
      eventMonth = d.getUTCMonth();
      eventDay = d.getUTCDate();
    } else {
      eventYear = d.getFullYear();
      eventMonth = d.getMonth();
      eventDay = d.getDate();
    }
  }

  const eventDate = new Date(eventYear, eventMonth, eventDay);

  if (useRelativeTime) {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    // Create a normalized Date object for both (at midnight local time)
    const eventMidnight = new Date(eventYear, eventMonth, eventDay);
    const currentMidnight = new Date(currentYear, currentMonth, currentDay);

    // Calculate the difference in milliseconds and convert to days
    // We use Math.round to account for possible DST shifts (e.g., 23 or 25 hour days)
    const diffInMs = eventMidnight.getTime() - currentMidnight.getTime();
    const differenceInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const formattedTime = rtf.format(differenceInDays, 'day');
    return <span>{formattedTime}</span>;
  }

  return (
    <span>
      {
        eventDate.toLocaleDateString(locale) // Date only (e.g., "1/23/2026")
      }
    </span>
  );
}

export default FormattedDate;
