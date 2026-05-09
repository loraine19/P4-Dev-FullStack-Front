import { create } from 'zustand';
import { tokenStorage } from '../utils/tokenStorage';
import type { UserPublic } from '../types/user.types';

/* IAUTH STATE */
interface IAuthState {
  token: string | null;
  user: UserPublic | null;
  isAuthenticated: boolean;
}

/* IAUTH ACTIONS */
interface IAuthActions {
  setToken(token: string): void;
  setUser(user: UserPublic): void;
  clearAuth(): void;
}

/* AUTH STORE */
const useAuthStore = create<IAuthState & IAuthActions>((set) => ({
  token: tokenStorage.get(),
  user: null,
  isAuthenticated: !!tokenStorage.get(),

  /* SET TOKEN (mode mobile) */
  setToken: (token) => set({ token, isAuthenticated: true }),

  /* SET USER (après login) */
  setUser: (user) => set({ user, isAuthenticated: true }),

  /* CLEAR AUTH */
  clearAuth: () => {
    tokenStorage.remove();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
