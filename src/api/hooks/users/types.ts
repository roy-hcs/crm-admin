import { FormValue } from '@/api/client';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  // Other user properties
}

export interface LoginParams extends Record<string, FormValue> {
  username: string;
  password: string;
  rememberMe: boolean;
  type: number;
}
