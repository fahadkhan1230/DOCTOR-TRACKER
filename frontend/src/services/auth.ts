import { api } from '@/lib/api';
import type { User } from '@/types';
import type { LoginForm } from '@/lib/schemas';

export const login = async (b: LoginForm) => (await api.post<{ data: User }>('/auth/login', b)).data.data;
export const logout = () => api.post('/auth/logout');
export const me = async () => (await api.get<{ data: User }>('/auth/me')).data.data;
