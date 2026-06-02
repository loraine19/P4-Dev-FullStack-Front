import { authApi } from '../api/authApi';
import { tokenStorage } from '../infrastructure/tokenStorage';
import { ERROR_MESSAGES } from '../constants/error-messages';
import type { LoginPayload, RegisterPayload, UserPublic } from '../types/user.types';
import type { ErrorMsg } from '../types/error.types';
import { catchApiError } from './serviceHelpers';

/* IAUTH SERVICE INTERFACE */
interface IAuthService {
  me(): Promise<UserPublic | ErrorMsg>;
  login(data: LoginPayload): Promise<UserPublic | ErrorMsg>;
  register(data: RegisterPayload): Promise<{ success: true } | ErrorMsg>;
  logout(): Promise<void | ErrorMsg>;
}

/* AUTH SERVICE */
class AuthService implements IAuthService {
  /* IS MOBILE CLIENT */
  private isMobileClient(): boolean {
    return /Mobile|Android|iPhone/i.test(navigator.userAgent);
  }

  /* ME */
  async me(): Promise<UserPublic | ErrorMsg> {
    try {
      const res = await authApi.me();
      return res.data.data as UserPublic;
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* LOGIN */
  async login(data: LoginPayload): Promise<UserPublic | ErrorMsg> {
    const isMobile = this.isMobileClient();
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
    return { message: ERROR_MESSAGES.AUTH.LOGIN_FAILED, level: 'error' };
  }

  /* REGISTER */
  async register(data: RegisterPayload): Promise<{ success: true } | ErrorMsg> {
    try {
      await authApi.register(data);
      return { success: true };
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* LOGOUT */
  async logout(): Promise<void | ErrorMsg> {
    try {
      await authApi.logout();
    } catch (error) {
      return catchApiError(error);
    }
    tokenStorage.remove();
  }
}

export const authService = new AuthService();
