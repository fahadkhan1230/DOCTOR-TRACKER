import { api, clean } from '@/lib/api';
import type { ListParams, Paginated, Patient } from '@/types';
import type { PatientForm } from '@/lib/schemas';

export const listPatients = async (params: ListParams) => (await api.get<Paginated<Patient>>('/patients', { params: clean(params) })).data;
export const getPatient = async (id: string) => (await api.get<{ data: Patient }>(`/patients/${id}`)).data.data;
export const createPatient = async (b: PatientForm) => (await api.post<{ data: Patient }>('/patients', b)).data.data;
export const updatePatient = async (id: string, b: PatientForm) => (await api.put<{ data: Patient }>(`/patients/${id}`, b)).data.data;
export const deletePatient = (id: string) => api.delete(`/patients/${id}`);
export const patientConditions = async () => (await api.get<{ data: { conditions: string[] } }>('/patients/meta')).data.data.conditions;
