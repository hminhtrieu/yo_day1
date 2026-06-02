import { apiClient } from '../../../lib/api';
import type { UserRole } from '../../../types/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  fullname?: string;
  role: UserRole;
}

export const login = async (data: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<any>('/auth/login', {
    username: data.username,
    password: data.password
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<any>('/auth/me');
  return response.data;
};
