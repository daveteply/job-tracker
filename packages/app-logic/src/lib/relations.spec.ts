import {
  deriveEventCompanyId,
  resolveCompanyId,
  resolveEntityId,
} from './relations';

describe('relations', () => {
  describe('deriveEventCompanyId', () => {
    it('should prioritize roleCompanyId', () => {
      expect(
        deriveEventCompanyId({
          roleCompanyId: 'role-1',
          contactCompanyId: 'contact-1',
          explicitCompanyId: 'explicit-1',
        })
      ).toBe('role-1');
    });

    it('should use contactCompanyId if roleCompanyId is missing', () => {
      expect(
        deriveEventCompanyId({
          roleCompanyId: null,
          contactCompanyId: 'contact-1',
          explicitCompanyId: 'explicit-1',
        })
      ).toBe('contact-1');
    });

    it('should use explicitCompanyId if others are missing', () => {
      expect(
        deriveEventCompanyId({
          roleCompanyId: null,
          contactCompanyId: null,
          explicitCompanyId: 'explicit-1',
        })
      ).toBe('explicit-1');
    });

    it('should return null if all are missing', () => {
      expect(
        deriveEventCompanyId({
          roleCompanyId: null,
          contactCompanyId: null,
          explicitCompanyId: null,
        })
      ).toBeNull();
    });
  });

  describe('resolveEntityId', () => {
    const upsertEntity = jest.fn();
    const createId = () => 'new-uuid';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return null if selection is marked for removal', async () => {
      const result = await resolveEntityId({
        selection: { id: '1', isNew: false, shouldRemove: true },
        currentId: '1',
      });
      expect(result).toBeNull();
    });

    it('should return currentId if no selection provided', async () => {
      const result = await resolveEntityId({
        selection: null,
        currentId: 'existing-1',
      });
      expect(result).toBe('existing-1');
    });

    it('should return existing id if selection is not new', async () => {
      const result = await resolveEntityId({
        selection: { id: 'existing-1', isNew: false, shouldRemove: false },
        currentId: 'old-1',
      });
      expect(result).toBe('existing-1');
    });

    it('should upsert and return new id for new selection', async () => {
      upsertEntity.mockResolvedValue({ id: 'new-uuid' });
      const result = await resolveEntityId({
        selection: { name: 'New Entity', isNew: true, shouldRemove: false },
        upsertEntity,
        createId,
      });

      expect(result).toBe('new-uuid');
      expect(upsertEntity).toHaveBeenCalledWith({
        id: 'new-uuid',
        name: 'New Entity',
      });
    });

    it('should handle additional fields and omit UI fields during upsert', async () => {
      upsertEntity.mockResolvedValue({ id: 'new-uuid' });
      const result = await resolveEntityId({
        selection: {
          name: 'New Entity',
          isNew: true,
          shouldRemove: false,
          displayValue: 'UI Value',
          customField: 'keep this',
        },
        upsertEntity,
        createId,
        additionalFields: { extra: 'data' },
      });

      expect(upsertEntity).toHaveBeenCalledWith({
        id: 'new-uuid',
        name: 'New Entity',
        customField: 'keep this',
        extra: 'data',
      });
      expect(result).toBe('new-uuid');
    });

    it('should use provided id for new selection if available', async () => {
      upsertEntity.mockResolvedValue({ id: 'provided-id' });
      const result = await resolveEntityId({
        selection: { id: 'provided-id', name: 'New Entity', isNew: true, shouldRemove: false },
        upsertEntity,
      });
      expect(result).toBe('provided-id');
      expect(upsertEntity).toHaveBeenCalledWith(expect.objectContaining({ id: 'provided-id' }));
    });

    it('should throw error if upsertEntity is missing for new selection', async () => {
      await expect(
        resolveEntityId({
          selection: { name: 'New', isNew: true, shouldRemove: false },
        })
      ).rejects.toThrow('Repository upsert is required to create a new entity');
    });

    it('should return currentId if selection not new and no name/identifying info', async () => {
      const result = await resolveEntityId({
        selection: { isNew: false, shouldRemove: false },
        currentId: 'current-1',
      });
      expect(result).toBe('current-1');
    });
  });

  describe('resolveCompanyId', () => {
    const upsertCompany = jest.fn();

    it('should wrap upsertCompany and call resolveEntityId', async () => {
      upsertCompany.mockResolvedValue({ id: 'comp-1' });
      const result = await resolveCompanyId({
        selection: { name: 'New Comp', isNew: true, shouldRemove: false },
        upsertCompany,
        createId: () => 'comp-1',
      });

      expect(result).toBe('comp-1');
      expect(upsertCompany).toHaveBeenCalledWith({
        id: 'comp-1',
        name: 'New Comp',
      });
    });
  });
});
