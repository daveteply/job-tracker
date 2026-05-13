import { canDeleteEntity, EMPTY_DELETION_BLOCKERS } from './deletion';

describe('deletion', () => {
  describe('canDeleteEntity', () => {
    it('should return true if there are no blockers', () => {
      expect(canDeleteEntity(EMPTY_DELETION_BLOCKERS)).toBe(true);
      expect(canDeleteEntity({ events: 0, contacts: 0, roles: 0 })).toBe(true);
    });

    it('should return false if there are event blockers', () => {
      expect(canDeleteEntity({ events: 1, contacts: 0, roles: 0 })).toBe(false);
    });

    it('should return false if there are contact blockers', () => {
      expect(canDeleteEntity({ events: 0, contacts: 1, roles: 0 })).toBe(false);
    });

    it('should return false if there are role blockers', () => {
      expect(canDeleteEntity({ events: 0, contacts: 0, roles: 1 })).toBe(false);
    });

    it('should return false if there are multiple blockers', () => {
      expect(canDeleteEntity({ events: 1, contacts: 1, roles: 1 })).toBe(false);
    });
  });
});
