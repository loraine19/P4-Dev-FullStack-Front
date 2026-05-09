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
  access_token?: string; // absent en mode web (cookie httpOnly)
}
