import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { tokenStorage } from '../infrastructure/tokenStorage';
import { authService } from '../services/authService';
import type { UserPublic, LoginPayload, RegisterPayload } from '../types/user.types';
import { isErrorMsg, type ErrorMsg } from '../types/error.types';

/* IAUTH STATE */
interface IAuthState {
  user: UserPublic | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: ErrorMsg | null;
}

/* IAUTH ACTIONS */
interface IAuthActions {
  verifySession(): Promise<void>;
  setInitialized(): void;
  setUser(user: UserPublic): void;
  clearError(): void;
  clearAuth(): void;
  login(credentials: LoginPayload): Promise<boolean>;
  register(data: RegisterPayload): Promise<boolean>;
  logout(): Promise<boolean>;
}

/* AUTH STORE */
const useAuthStore = create<IAuthState & IAuthActions>((set) => ({
  user: null,
  isAuthenticated: !!tokenStorage.get(),
  isInitialized: false,
  isLoading: false,
  error: null,

  /* VERIFY SESSION */
  // called once on app mount - validates cookie (web) or Bearer token (mobile)
  verifySession: async () => {
    const result = await authService.me();
    if (isErrorMsg(result)) {
      set({ isAuthenticated: false, user: null, isInitialized: true });
    } else {
      set({ isAuthenticated: true, user: result, isInitialized: true });
    }
  },

  /* SET INITIALIZED */
  setInitialized: () => set({ isInitialized: true }),

  /* SET USER */
  setUser: (user) => set({ user, isAuthenticated: true }),

  /* CLEAR ERROR */
  clearError: () => set({ error: null }),

  /* CLEAR AUTH */
  clearAuth: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  /* LOGIN ORCHESTRATION */
  login: async (credentials: LoginPayload): Promise<boolean> => {
    set({ isLoading: true, error: null });
    const response: UserPublic | ErrorMsg = await authService.login(credentials);
    if (isErrorMsg(response)) {
      set({ error: response, isAuthenticated: false, isLoading: false });
      return false;
    }
    set({ user: response, isAuthenticated: true, error: null, isLoading: false });
    return true;
  },

  /* REGISTER ORCHESTRATION */
  register: async (data: RegisterPayload): Promise<boolean> => {
    set({ isLoading: true, error: null });
    const response = await authService.register(data);
    if (isErrorMsg(response)) {
      set({ error: response, isAuthenticated: false, isLoading: false });
      return false;
    }
    else {
      set({ error: null, isLoading: false });
      return true;
    }
  },

  /* LOGOUT */
  logout: async (): Promise<boolean> => {
    const result = await authService.logout();
    if (isErrorMsg(result)) {
      set({ error: result, isAuthenticated: false, isLoading: false });
      return false;
    } else {
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
      return true;
    }
  },
}));

/* USE AUTH STORE SHALLOW */
export const useAuthStoreShallow = <T,>(selector: (s: IAuthState & IAuthActions) => T) =>
  useAuthStore(useShallow(selector));

export default useAuthStore;
