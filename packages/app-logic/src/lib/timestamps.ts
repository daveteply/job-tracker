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
