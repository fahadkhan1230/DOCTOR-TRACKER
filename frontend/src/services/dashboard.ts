import { api } from '@/lib/api';
import type { DashboardStats } from '@/types';

const get = async <T,>(path: string) => (await api.get<{ data: T }>(`/dashboard/${path}`)).data.data;
export const getStats = () => get<DashboardStats>('stats');
export const patientsPerDoctor = () => get<{ doctorId: string; name: string; patients: number }[]>('patients-per-doctor');
export const monthlyStats = () => get<{ month: string; patients: number; doctors: number }[]>('monthly-stats');
export const specializationStats = () => get<{ name: string; value: number }[]>('specialization-stats');
