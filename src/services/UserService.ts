import { userApi } from '../api/userApi';
import { tokenStorage } from '../utils/tokenStorage';
import type { LoginPayload, RegisterPayload, AuthResponse, UserPublic } from '../types/user.types';

/* IUSER SERVICE INTERFACE */
interface IUserService {
  login(data: LoginPayload): Promise<AuthResponse | null>;
  register(data: RegisterPayload): Promise<{ message: string } | null>;
  logout(): Promise<void>;
  getUser(): UserPublic | null;
}

/* USER SERVICE */
class UserService implements IUserService {
  /* LOGIN */
  async login(data: LoginPayload): Promise<AuthResponse | null> {
    const res = await userApi.login(data);
    // mode mobile : token retourné dans le body → localStorage
    // mode web    : cookie httpOnly set par le serveur automatiquement
    if (data.isMobile && res.data.access_token) {
      tokenStorage.set(res.data.access_token);
    }
    return res.data;
  }

  /* REGISTER */
  async register(data: RegisterPayload): Promise<{ message: string } | null> {
    const res = await userApi.register(data);
    return res.data;
  }

  /* LOGOUT */
  async logout(): Promise<void> {
    await userApi.logout();
    tokenStorage.remove();
  }

  /* GET USER (desde store) */
  getUser(): UserPublic | null {
    return null; // délégué au store, méthode stub
  }
}

export const userService = new UserService();
