import apiClient from './apiClient';
import type { LoginPayload, RegisterPayload, AuthResponse, UserPublic } from '../types/user.types';
import type { ApiResponseEnvelope } from '../types/api.types';

/* IAUTH API INTERFACE */
interface IAuthApi {
  me(): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<UserPublic>>>;
  login(data: LoginPayload): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<AuthResponse>>>;
  register(data: RegisterPayload): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<null>>>;
  logout(): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<null>>>;
}

/* AUTH API */
class AuthApi implements IAuthApi {
  /* ME */
  me() {
    return apiClient.get<ApiResponseEnvelope<UserPublic>>('/auth/me');
  }

  /* LOGIN */
  login(data: LoginPayload) {
    return apiClient.post<ApiResponseEnvelope<AuthResponse>>('/auth/login', data);
  }

  /* REGISTER */
  register(data: RegisterPayload) {
    return apiClient.post<ApiResponseEnvelope<null>>('/auth/register', data);
  }

  /* LOGOUT */
  logout() {
    return apiClient.post<ApiResponseEnvelope<null>>('/auth/logout');
  }
}

export const authApi = new AuthApi();
