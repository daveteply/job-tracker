const MAX_SEARCH_LIMIT = 50;
export const DEFAULT_SEARCH_LIMIT = 10;

export interface NormalizedSearchInput {
  pattern: string;
  limit: number;
}

export function normalizeSearchInput(
  query: string,
  limit = DEFAULT_SEARCH_LIMIT,
): NormalizedSearchInput | null {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return null;

  return {
    pattern: escapeRegex(trimmedQuery),
    limit: clampSearchLimit(limit),
  };
}

export function clampSearchLimit(limit: number): number {
  return Math.max(1, Math.min(limit, MAX_SEARCH_LIMIT));
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
