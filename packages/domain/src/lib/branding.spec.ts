import { BRANDING } from './branding';

describe('BRANDING', () => {
  it('should have correct values', () => {
    expect(BRANDING.name).toBe('Vireo');
    expect(BRANDING.domain).toBe('tryvireo.app');
    expect(BRANDING.betaGateStorageKey).toBe('vireo-beta-approved');
  });
});
