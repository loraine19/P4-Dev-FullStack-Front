import { describe, it, expect, vi, beforeEach } from 'vitest';

/* Mock avant tout import du service */
vi.mock('../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));
vi.mock('../infrastructure/tokenStorage', () => ({
  tokenStorage: { set: vi.fn(), remove: vi.fn(), get: vi.fn() },
}));

import { authApi } from '../api/authApi';
import { authService } from './authService';
import type { RegisterPayload } from '../types/user.types';

/* Helpers */
const mockLogin = authApi.login as ReturnType<typeof vi.fn>;
const mockRegister = authApi.register as ReturnType<typeof vi.fn>;
const mockLogout = authApi.logout as ReturnType<typeof vi.fn>;

const makeApiOk = (data: unknown) => ({
  data: { status: 'success', message: 'ok', data },
});

beforeEach(() => vi.clearAllMocks());

/* ----------------------------------------------------------------- login() */
describe('authService.login()', () => {
  it('S.1 ok response → returns user', async () => {
    /* Arrange */
    const user = { id: 1, email: 'alice@test.com', username: 'alice' };
    mockLogin.mockResolvedValueOnce(makeApiOk({ user, access_token: null }));

    /* Act */
    const result = await authService.login({ email: 'alice@test.com', password: 'password' });

    /* Assert */
    expect(result).toEqual(user);
  });

  it('S.2 network 401 → returns ErrorMsg', async () => {
    /* Arrange */
    mockLogin.mockRejectedValueOnce({ response: { status: 401 } });

    /* Act */
    const result = await authService.login({ email: 'bad@test.com', password: 'wrong' });

    /* Assert */
    expect(result).toMatchObject({ message: expect.any(String), level: 'error' });
  });

  it('S.3 network error no status → generic message', async () => {
    /* Arrange */
    mockLogin.mockRejectedValueOnce(new Error('Network error'));

    /* Act */
    const result = await authService.login({ email: 'bad@test.com', password: 'x' });

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* ----------------------------------------------------------------- register() */
describe('authService.register()', () => {
  it('S.4 ok response → returns { success: true }', async () => {
    /* Arrange */
    mockRegister.mockResolvedValueOnce(makeApiOk(null));

    /* Act */
    const payload : RegisterPayload = { email: 'new@test.com', password: 'password', name: 'new' } ;
    const result = await authService.register(payload);

    /* Assert */
    expect(result).toEqual({ success: true });
  });

  it('S.5 400 error → ErrorMsg', async () => {
    /* Arrange */
    mockRegister.mockRejectedValueOnce({ response: { status: 400 } });

    /* Act */
    const payload : RegisterPayload = { email: '', password: '', name: '' } ;
    const result = await authService.register(payload);

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* ----------------------------------------------------------------- logout() */
describe('authService.logout()', () => {
  it('S.6 calls authApi.logout and tokenStorage.remove', async () => {
    /* Arrange */
    mockLogout.mockResolvedValueOnce(makeApiOk(null));

    /* Act */
    await authService.logout();

    /* Assert */
    expect(mockLogout).toHaveBeenCalledOnce();
  });
});
