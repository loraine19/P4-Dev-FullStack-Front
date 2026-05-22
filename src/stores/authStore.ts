import { create } from 'zustand';
import { tokenStorage } from '../infrastructure/tokenStorage';
import { authService } from '../services/authService';
import type { UserPublic, LoginPayload, RegisterPayload } from '../types/user.types';
import type { ErrorMsg } from '../types/error.types';

/* IAUTH STATE */
interface IAuthState {
  user: UserPublic | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ErrorMsg | null;
}

/* IAUTH ACTIONS */
interface IAuthActions {
  setUser(user: UserPublic): void;
  clearError(): void;
  clearAuth(): void;
  login(credentials: LoginPayload): Promise<boolean>;
  register(data: RegisterPayload): Promise<boolean>;
  logout(): Promise<void>;
}

/* AUTH STORE */
const useAuthStore = create<IAuthState & IAuthActions>((set) => ({
  user: null,
  isAuthenticated: !!tokenStorage.get(),
  isLoading: false,
  error: null,

  /* SET USER */
  setUser: (user) => set({ user, isAuthenticated: true }),

  /* CLEAR ERROR */
  clearError: () => {
    set({ error: null });
  },

  /* CLEAR AUTH */
  clearAuth: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  /* LOGIN ORCHESTRATION */
  login: async (credentials: LoginPayload): Promise<boolean> => {
    set({ isLoading: true, error: null });
    const response: UserPublic | ErrorMsg = await authService.login(credentials);
    if ('level' in response) {
      set({ error: response as ErrorMsg, isAuthenticated: false, isLoading: false });
      return false;
    } else if (response) {
      set({ user: response, isAuthenticated: true, error: null, isLoading: false });
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  /* REGISTER ORCHESTRATION */
  register: async (data: RegisterPayload): Promise<boolean> => {
    set({ isLoading: true, error: null });
    const response = await authService.register(data);
    if ('level' in response) {
      set({ error: response as ErrorMsg, isAuthenticated: false, isLoading: false });
      return false;
    } else if ('success' in response && response.success) {
      set({ error: null, isLoading: false });
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  /* LOGOUT */
  logout: async (): Promise<void> => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;
