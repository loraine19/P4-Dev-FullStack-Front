import apiClient from './apiClient';
import type { LoginPayload, RegisterPayload, AuthResponse, ApiResponseEnvelope } from '../types/user.types';

/* IAUTH API INTERFACE */
interface IAuthApi {
  login(data: LoginPayload): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<AuthResponse>>>;
  register(data: RegisterPayload): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<null>>>;
  logout(): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<null>>>;
}

/* AUTH API */
class AuthApi implements IAuthApi {
  /* LOGIN */
  login(data: LoginPayload) {
    const response = apiClient.post<ApiResponseEnvelope<AuthResponse>>('/auth/login', data);
    return response;
  }

  /* REGISTER */
  register(data: RegisterPayload) {
    const response = apiClient.post<ApiResponseEnvelope<null>>('/auth/register', data);
    return response;
  }

  /* LOGOUT */
  logout() {
    const response = apiClient.post<ApiResponseEnvelope<null>>('/auth/logout');
    return response;
  }
}

export const authApi = new AuthApi();
