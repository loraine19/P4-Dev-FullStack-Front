import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('../infrastructure/tokenStorage', () => ({
  tokenStorage: { get: vi.fn(), remove: vi.fn() },
}));

import { tokenStorage } from '../infrastructure/tokenStorage';
import apiClient from './apiClient';

/* HELPERS */
type AxiosAdapterFn = NonNullable<typeof apiClient.defaults.adapter>;

const withAdapter = (fn: AxiosAdapterFn) => {
  const original = apiClient.defaults.adapter;
  apiClient.defaults.adapter = fn;
  return () => { apiClient.defaults.adapter = original; };
};

/* REQUEST INTERCEPTOR */
describe('apiClient — request interceptor', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  /* 1 */
  it('1 attaches Bearer token when tokenStorage has a value', async () => {
    /* Arrange */
    (tokenStorage.get as ReturnType<typeof vi.fn>).mockReturnValue('my-token');
    let capturedAuth: string | undefined;

    // adapter runs after all request interceptors → headers are finalised
    const restore = withAdapter(async (config) => {
      capturedAuth = (config.headers as Record<string, string>).Authorization;
      return { data: null, status: 200, statusText: 'OK', headers: {}, config, request: {} };
    });

    /* Act */
    await apiClient.get('/any');
    restore();

    /* Assert */
    expect(capturedAuth).toBe('Bearer my-token');
  });

  /* 2 */
  it('2 does not set Authorization header when no token', async () => {
    /* Arrange */
    (tokenStorage.get as ReturnType<typeof vi.fn>).mockReturnValue(null);
    let capturedAuth: string | undefined = 'initial';

    const restore = withAdapter(async (config) => {
      capturedAuth = (config.headers as Record<string, string | undefined>).Authorization;
      return { data: null, status: 200, statusText: 'OK', headers: {}, config, request: {} };
    });

    /* Act */
    await apiClient.get('/any');
    restore();

    /* Assert */
    expect(capturedAuth).toBeUndefined();
  });
});

/* RESPONSE INTERCEPTOR */
describe('apiClient — response interceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', { value: { href: '' }, writable: true });
  });

  afterEach(() => { apiClient.defaults.adapter = undefined; });

  const make401Adapter = (url: string): AxiosAdapterFn => async (config) => {
    const err = new axios.AxiosError('Unauthorized', '401', { ...config, url }, {}, {
      status: 401, data: {}, headers: {}, config: { ...config, url } as never, statusText: 'Unauthorized',
    });
    throw err;
  };

  /* 3 */
  it('3 clears token and redirects on 401 for protected routes', async () => {
    /* Arrange */
    (tokenStorage.get as ReturnType<typeof vi.fn>).mockReturnValue('t');
    apiClient.defaults.adapter = make401Adapter('/files');

    /* Act */
    await apiClient.get('/files').catch(() => {});

    /* Assert */
    expect(tokenStorage.remove).toHaveBeenCalled();
    expect(window.location.href).toBe('/');
  });

  /* 4 */
  it('4 does not redirect on 401 for /download/ (wrong password)', async () => {
    /* Arrange */
    apiClient.defaults.adapter = make401Adapter('/download/abc123');

    /* Act */
    await apiClient.get('/download/abc123').catch(() => {});

    /* Assert */
    expect(tokenStorage.remove).not.toHaveBeenCalled();
    expect(window.location.href).not.toBe('/');
  });

  /* 5 */
  it('5 clears token but does not redirect on 401 for /auth/login', async () => {
    /* Arrange */
    apiClient.defaults.adapter = make401Adapter('/auth/login');

    /* Act */
    await apiClient.post('/auth/login', {}).catch(() => {});

    /* Assert */
    expect(tokenStorage.remove).toHaveBeenCalled();
    expect(window.location.href).not.toBe('/');
  });

  /* 6 */
  it('6 clears token but does not redirect on 401 for /auth/me (verifySession)', async () => {
    /* Arrange */
    apiClient.defaults.adapter = make401Adapter('/auth/me');

    /* Act */
    await apiClient.get('/auth/me').catch(() => {});

    /* Assert */
    expect(tokenStorage.remove).toHaveBeenCalled();
    expect(window.location.href).not.toBe('/');
  });
});
