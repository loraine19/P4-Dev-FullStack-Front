import { userApi } from '../api/userApi';
import { tokenStorage } from '../utils/tokenStorage';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/user.types';

/* IUSER SERVICE INTERFACE */
interface IUserService {
  login(data: LoginPayload): Promise<AuthResponse | null>;
  register(data: RegisterPayload): Promise<AuthResponse | null>;
  logout(): void;
}

/* USER SERVICE */
class UserService implements IUserService {
  /* LOGIN */
  async login(data: LoginPayload): Promise<AuthResponse | null> {
    const res = await userApi.login(data);
    if (res.data.access_token) tokenStorage.set(res.data.access_token);
    return res.data;
  }

  /* REGISTER */
  async register(data: RegisterPayload): Promise<AuthResponse | null> {
    const res = await userApi.register(data);
    if (res.data.access_token) tokenStorage.set(res.data.access_token);
    return res.data;
  }

  /* LOGOUT */
  logout(): void {
    tokenStorage.remove();
  }
}

export const userService = new UserService();
