import { getLocaleCookie, setLocaleCookie } from './locale-cookie';

describe('locale-cookie', () => {
  beforeEach(() => {
    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  it('should set and get locale cookie', () => {
    setLocaleCookie('es-US');
    expect(getLocaleCookie()).toBe('es-US');
  });

  it('should return undefined if cookie is not set', () => {
    expect(getLocaleCookie()).toBeUndefined();
  });
});
