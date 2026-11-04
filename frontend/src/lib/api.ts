import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true, // JWT lives in an HttpOnly cookie; JS never sees it
  timeout: 15000,
});

// Expired/invalid session on any protected call -> back to login.
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url: string = err.config?.url ?? '';
    if (err.response?.status === 401 && !url.includes('/auth/') && typeof window !== 'undefined') {
      window.location.assign('/login?expired=1');
    }
    return Promise.reject(err);
  },
);

export interface FieldError { field: string; message: string }
export function errorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) return e.response?.data?.message ?? 'Cannot reach the server. Please try again.';
  return 'Something went wrong';
}
export function fieldErrors(e: unknown): FieldError[] {
  return axios.isAxiosError(e) ? (e.response?.data?.errors ?? []) : [];
}
export const clean = <T extends Record<string, unknown>>(p: T) =>
  Object.fromEntries(Object.entries(p).filter(([, v]) => v !== '' && v !== undefined));
