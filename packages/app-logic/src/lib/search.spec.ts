import {
  clampSearchLimit,
  DEFAULT_SEARCH_LIMIT,
  escapeRegex,
  normalizeSearchInput,
} from './search';

describe('search', () => {
  describe('escapeRegex', () => {
    it('should escape regex special characters', () => {
      expect(escapeRegex('*.?+')).toBe('\\*\\.\\?\\+');
      expect(escapeRegex('[abc]')).toBe('\\[abc\\]');
      expect(escapeRegex('(group)')).toBe('\\(group\\)');
    });

    it('should leave normal characters alone', () => {
      expect(escapeRegex('hello world')).toBe('hello world');
    });
  });

  describe('clampSearchLimit', () => {
    it('should clamp values within range', () => {
      expect(clampSearchLimit(5)).toBe(5);
    });

    it('should clamp negative values to 1', () => {
      expect(clampSearchLimit(-1)).toBe(1);
      expect(clampSearchLimit(0)).toBe(1);
    });

    it('should clamp high values to MAX_SEARCH_LIMIT (50)', () => {
      expect(clampSearchLimit(100)).toBe(50);
    });
  });

  describe('normalizeSearchInput', () => {
    it('should return null for empty query', () => {
      expect(normalizeSearchInput('')).toBeNull();
      expect(normalizeSearchInput('   ')).toBeNull();
    });

    it('should normalize valid query', () => {
      const result = normalizeSearchInput('  Hello*  ');
      expect(result).toEqual({
        pattern: 'hello\\*',
        limit: DEFAULT_SEARCH_LIMIT,
      });
    });

    it('should use provided limit', () => {
      const result = normalizeSearchInput('test', 20);
      expect(result?.limit).toBe(20);
    });

    it('should clamp provided limit', () => {
      const result = normalizeSearchInput('test', 200);
      expect(result?.limit).toBe(50);
    });
  });
});
