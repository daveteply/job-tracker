'use client';

import { useEffect, useState } from 'react';

export interface FormattedDateProps {
  dateValue?: Date;
  useRelativeTime?: boolean;
}

export function FormattedDate({ dateValue, useRelativeTime = true }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !dateValue) return null;

  const eventDate = new Date(dateValue);
  if (useRelativeTime) {
    const currentDate = new Date();

    // Calculate difference in calendar days
    const eventMidnight = new Date(eventDate);
    eventMidnight.setHours(0, 0, 0, 0);
    const currentMidnight = new Date(currentDate);
    currentMidnight.setHours(0, 0, 0, 0);

    const differenceInDays = Math.round(
      (eventMidnight.getTime() - currentMidnight.getTime()) / 86400000
    );

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const formattedTime = rtf.format(differenceInDays, 'day');
    return <span>{formattedTime}</span>;
  }

  return (
    <span>
      {
        eventDate.toLocaleDateString() // Date only (e.g., "1/23/2026")
      }
    </span>
  );
}

export default FormattedDate;
