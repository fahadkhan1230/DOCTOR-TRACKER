import axios from 'axios';

// Same-origin "/api" by default (Vercel forwards it to the backend). trim() guards against stray spaces.
const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? '').trim() || '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true, // JWT lives in an HttpOnly cookie; JS never sees it
  timeout: 90000, // free-tier backends can take ~60s to wake up
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
  if (axios.isAxiosError(e)) {
    if (e.response?.data?.message) return e.response.data.message;
    if (e.response) return `Server error (${e.response.status}). The backend may be starting up, please retry in a minute.`;
    return 'Cannot reach the server. Please try again.';
  }
  return 'Something went wrong';
}

export function fieldErrors(e: unknown): FieldError[] {
  return axios.isAxiosError(e) ? (e.response?.data?.errors ?? []) : [];
}

export const clean = <T extends Record<string, unknown>>(p: T) =>
  Object.fromEntries(Object.entries(p).filter(([, v]) => v !== '' && v !== undefined));