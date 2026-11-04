import { api, clean } from '@/lib/api';
import type { Doctor, ListParams, Paginated, Patient } from '@/types';
import type { DoctorForm } from '@/lib/schemas';

export interface DoctorMeta { specializations: string[]; hospitals: string[]; doctors: { _id: string; name: string }[] }

export const listDoctors = async (params: ListParams) => (await api.get<Paginated<Doctor>>('/doctors', { params: clean(params) })).data;
export const getDoctor = async (id: string) => (await api.get<{ data: Doctor }>(`/doctors/${id}`)).data.data;
export const createDoctor = async (b: DoctorForm) => (await api.post<{ data: Doctor }>('/doctors', b)).data.data;
export const updateDoctor = async (id: string, b: DoctorForm) => (await api.put<{ data: Doctor }>(`/doctors/${id}`, b)).data.data;
export const deleteDoctor = (id: string, reassignTo?: string) => api.delete(`/doctors/${id}`, { params: clean({ reassignTo }) });
export const doctorPatients = async (id: string, params: ListParams) =>
  (await api.get<Paginated<Patient>>(`/doctors/${id}/patients`, { params })).data;
export const doctorMeta = async () => (await api.get<{ data: DoctorMeta }>('/doctors/meta')).data.data;
