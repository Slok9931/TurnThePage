import api from '@/lib/api';
import type { AuthResponse, User } from '@/types';

export const authApi = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signup', { name, email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const { data } = await api.get<{ user: User }>('/auth/profile');
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
