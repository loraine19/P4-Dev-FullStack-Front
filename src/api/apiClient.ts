import axios from 'axios';
import { shouldClearTokenOn401, shouldRedirectOn401 } from './publicApiPaths';
import { tokenStorage } from '../infrastructure/tokenStorage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // sends the httpOnly cookie automatically (web mode)
});

/* REQUEST INTERCEPTOR */
// attach Bearer token before each request
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* RESPONSE INTERCEPTOR */
// 401 - clear token and redirect to welcome, except on login requests
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const isAxios = axios.isAxiosError(error);
    const status = isAxios ? error.response?.status : null;
    const requestUrl = isAxios ? error.config?.url ?? '' : '';

    if (status === 401) {
      if (shouldClearTokenOn401(requestUrl)) tokenStorage.remove();
      if (shouldRedirectOn401(requestUrl)) window.location.href = '/';
    }

    return Promise.reject(error);
  },
);

export default apiClient;
