import apiClient from './apiClient';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/user.types';

/* IUSER API INTERFACE */
interface IUserApi {
  login(data: LoginPayload): Promise<import('axios').AxiosResponse<AuthResponse>>;
  register(data: RegisterPayload): Promise<import('axios').AxiosResponse<AuthResponse>>;
}

/* USER API */
class UserApi implements IUserApi {
  /* LOGIN */
  login(data: LoginPayload) {
    return apiClient.post<AuthResponse>('/auth/login', data);
  }

  /* REGISTER */
  register(data: RegisterPayload) {
    return apiClient.post<AuthResponse>('/auth/register', data);
  }
}

export const userApi = new UserApi();
