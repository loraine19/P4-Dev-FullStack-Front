import axios from 'axios';
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
    const isLoginRequest = requestUrl.includes('/auth/login');
    // session probe — 401 is expected when not logged in; verifySession handles it
    const isMeRequest = requestUrl.includes('/auth/me');

    // download endpoint uses 401 for wrong password - public route, not a session error
    const isDownloadRequest = requestUrl.includes('/download/');

    if (status === 401 && !isDownloadRequest) {
      tokenStorage.remove();
      if (!isLoginRequest && !isMeRequest) {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
