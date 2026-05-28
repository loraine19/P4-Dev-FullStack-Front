import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/authService', () => ({
  authService: {
    login:    vi.fn(),
    register: vi.fn(),
    logout:   vi.fn(),
  },
}));

vi.mock('../infrastructure/tokenStorage', () => ({
  tokenStorage: {
    get:    vi.fn().mockReturnValue(null),
    set:    vi.fn(),
    remove: vi.fn(),
  },
}));

import useAuthStore from './authStore';
import { authService } from '../services/authService';

const mockLogin    = authService.login    as ReturnType<typeof vi.fn>;
const mockRegister = authService.register as ReturnType<typeof vi.fn>;
const mockLogout   = authService.logout   as ReturnType<typeof vi.fn>;

const RESET = { user: null, isAuthenticated: false, isLoading: false, error: null };

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState(RESET);
});

/* login() */
describe('authStore -  login()', () => {
  it('2.1.1 login ok → user set, isAuthenticated true', async () => {
    /* Arrange */
    const user = { id: 1, email: 'alice@test.com', name: 'Alice' };
    mockLogin.mockResolvedValueOnce(user);

    /* Act */
    const success = await useAuthStore.getState().login({ email: 'alice@test.com', password: 'pass123' });

    /* Assert */
    expect(success).toBe(true);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('2.1.2 login error → isAuthenticated false, error set', async () => {
    /* Arrange */
    mockLogin.mockResolvedValueOnce({ level: 'error', message: 'Identifiants invalides' });

    /* Act */
    const success = await useAuthStore.getState().login({ email: 'x@x.com', password: 'wrong' });

    /* Assert */
    expect(success).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().error).toMatchObject({ level: 'error' });
  });
});

/* register() */
describe('authStore -  register()', () => {
  it('2.2.1 register ok → returns true, error stays null', async () => {
    /* Arrange */
    mockRegister.mockResolvedValueOnce({ success: true });

    /* Act */
    const success = await useAuthStore.getState().register({ name: 'Alice', email: 'alice@test.com', password: 'pass123' });

    /* Assert */
    expect(success).toBe(true);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('2.2.2 register error → returns false, error set', async () => {
    /* Arrange */
    mockRegister.mockResolvedValueOnce({ level: 'error', message: 'Email déjà pris' });

    /* Act */
    const success = await useAuthStore.getState().register({ name: 'Bob', email: 'taken@test.com', password: 'pass123' });

    /* Assert */
    expect(success).toBe(false);
    expect(useAuthStore.getState().error).toMatchObject({ level: 'error' });
  });
});

/* logout() */
describe('authStore -  logout()', () => {
  it('2.3.1 logout → user null, isAuthenticated false', async () => {
    /* Arrange */
    useAuthStore.setState({ user: { id: 1, email: 'a@b.com', name: 'A' }, isAuthenticated: true });
    mockLogout.mockResolvedValueOnce(undefined);

    /* Act */
    await useAuthStore.getState().logout();

    /* Assert */
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

/* setUser / clearError / clearAuth */
describe('authStore -  setUser / clearError / clearAuth', () => {
  it('2.4.1 setUser → user and isAuthenticated updated', () => {
    /* Arrange */
    const user = { id: 2, email: 'bob@test.com', name: 'Bob' };

    /* Act */
    useAuthStore.getState().setUser(user);

    /* Assert */
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('2.5.1 clearError → error reset to null', () => {
    /* Arrange */
    useAuthStore.setState({ error: { level: 'error', message: 'err' } });

    /* Act */
    useAuthStore.getState().clearError();

    /* Assert */
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('2.6.1 clearAuth → user, isAuthenticated, error all reset', () => {
    /* Arrange */
    useAuthStore.setState({ user: { id: 1, email: 'a@b.com', name: 'A' }, isAuthenticated: true, error: { level: 'error', message: 'x' } });

    /* Act */
    useAuthStore.getState().clearAuth();

    /* Assert */
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });
});
