export interface User {
  id?: string | number;
  username?: string;
  email?: string;
  photo?: string;
  name?: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  telefono: string;
  email: string;
  password: string;
  confirm: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
  [key: string]: unknown;
}
