import { AVAILABLE_ACTIONS } from './actions';

describe('AVAILABLE_ACTIONS', () => {
  it('should have a list of available actions', () => {
    expect(AVAILABLE_ACTIONS.length).toBeGreaterThan(0);
  });

  it('should have expected actions', () => {
    const ids = AVAILABLE_ACTIONS.map(a => a.id);
    expect(ids).toContain('applied-to-role');
    expect(ids).toContain('interview-completed');
    expect(ids).toContain('not-selected');
  });

  it('should have required properties for each action', () => {
    AVAILABLE_ACTIONS.forEach(action => {
      expect(action.id).toBeDefined();
      expect(action.nameKey).toBeDefined();
      expect(action.iconName).toBeDefined();
      expect(action.defaults).toBeDefined();
      expect(action.defaults.eventTypeName).toBeDefined();
      expect(action.defaults.direction).toBeDefined();
      expect(action.defaults.source).toBeDefined();
    });
  });
});
