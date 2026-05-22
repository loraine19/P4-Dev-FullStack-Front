import { authApi } from '../api/authApi';
import { tokenStorage } from '../infrastructure/tokenStorage';
import type { LoginPayload, RegisterPayload, UserPublic } from '../types/user.types';
import type { ErrorMsg } from '../types/error.types';
import { catchApiError, getApiError } from './serviceHelpers';

/* IAUTH SERVICE INTERFACE */
interface IAuthService {
  login(data: LoginPayload): Promise<UserPublic | ErrorMsg>;
  register(data: RegisterPayload): Promise<{ success: true } | ErrorMsg>;
  logout(): Promise<void>;
  getUser(): UserPublic | null;
}

/* AUTH SERVICE */
class AuthService implements IAuthService {
  /* LOGIN */
  async login(data: LoginPayload): Promise<UserPublic | ErrorMsg> {
    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
    try {
      const res = await authApi.login({ ...data, isMobile });
      const payload = res.data.data;
      if (payload) {
        if (isMobile && payload?.access_token) tokenStorage.set(payload.access_token);
        return payload?.user;
      }
    } catch (error) {
      return catchApiError(error);
    }
    return { message: 'Login failed', level: 'error' };
  }

  /* REGISTER */
  async register(data: RegisterPayload): Promise<{ success: true } | ErrorMsg> {
    try {
      const res = await authApi.register(data);
      const apiError = getApiError(res.data);
      if (apiError) return apiError;
      return { success: true };
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* LOGOUT */
  async logout(): Promise<void> {
    await authApi.logout();
    tokenStorage.remove();
  }

  /* GET USER */
  // delegated to the store — stub kept for interface compliance
  getUser(): UserPublic | null {
    return null;
  }
}

export const authService = new AuthService();
