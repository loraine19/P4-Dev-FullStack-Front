export interface UserPublic {
  id: number;
  email: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  isMobile?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: UserPublic;
  access_token?: string; 
}

export interface ApiResponseEnvelope<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}
