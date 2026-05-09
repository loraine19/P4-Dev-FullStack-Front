import { create } from 'zustand';
import { tokenStorage } from '../utils/tokenStorage';

/* IAUTH STATE */
interface IAuthState {
  token: string | null;
}

/* IAUTH ACTIONS */
interface IAuthActions {
  setToken(token: string): void;
  clearAuth(): void;
}

/* AUTH STORE */
const useAuthStore = create<IAuthState & IAuthActions>((set) => ({
  token: tokenStorage.get(),

  /* SET TOKEN */
  setToken: (token) => set({ token }),

  /* CLEAR AUTH */
  clearAuth: () => set({ token: null }),
}));

export default useAuthStore;
