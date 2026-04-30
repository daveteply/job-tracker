export interface AuditTimestamps {
  createdAt: string;
  updatedAt: string;
}

export function createAuditTimestamps(now = new Date()): AuditTimestamps {
  const isoNow = now.toISOString();
  return {
    createdAt: isoNow,
    updatedAt: isoNow,
  };
}

export function createUpdatedAt(now = new Date()): string {
  return now.toISOString();
}

export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let count = 0;
  const absDays = Math.abs(days);
  const step = days >= 0 ? 1 : -1;

  while (count < absDays) {
    result.setDate(result.getDate() + step);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
}
