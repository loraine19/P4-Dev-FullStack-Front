import { describe, it, expect, vi, beforeEach } from 'vitest';

/* Mock apiClient before importing authApi */
vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from './apiClient';
import { authApi } from './authApi';

const mockPost = apiClient.post as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

/* ----------------------------------------------------------------- login() */
describe('authApi.login()', () => {
  it('14.1 appelle POST /auth/login avec les credentials', async () => {
    /* Arrange */
    const payload = { email: 'a@test.com', password: 'pass' };
    mockPost.mockResolvedValueOnce({ data: { status: 'success', data: {} } });

    /* Act */
    await authApi.login(payload);

    /* Assert */
    expect(mockPost).toHaveBeenCalledWith('/auth/login', payload);
  });
});

/* --------------------------------------------------------------- register() */
describe('authApi.register()', () => {
  it('14.2 appelle POST /auth/register avec name/email/password', async () => {
    /* Arrange */
    const payload = { name: 'Alice', email: 'a@test.com', password: 'pass', passwordConfirm: 'pass' };
    mockPost.mockResolvedValueOnce({ data: { status: 'success', data: null } });

    /* Act */
    await authApi.register(payload);

    /* Assert */
    expect(mockPost).toHaveBeenCalledWith('/auth/register', payload);
  });
});

/* ---------------------------------------------------------------- logout() */
describe('authApi.logout()', () => {
  it('14.3 appelle POST /auth/logout sans payload', async () => {
    /* Arrange */
    mockPost.mockResolvedValueOnce({ data: { status: 'success', data: null } });

    /* Act */
    await authApi.logout();

    /* Assert */
    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
  });
});
