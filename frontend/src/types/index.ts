export interface User { id: string; name: string; email: string }
export interface Doctor {
  _id: string; name: string; specialization: string; hospital: string; phone: string; email: string;
  patientCount?: number; createdAt: string; updatedAt: string;
}
export interface DoctorRef { _id: string; name: string; specialization?: string; hospital?: string }
export interface Patient {
  _id: string; name: string; age: number; gender: 'Male' | 'Female' | 'Other'; phone: string; condition: string;
  doctorId: DoctorRef | string; createdAt: string; updatedAt: string;
}
export interface PageInfo { currentPage: number; limit: number; totalRecords: number; totalPages: number }
export interface Paginated<T> { success: true; data: T[]; pagination: PageInfo }
export interface DashboardStats {
  totalDoctors: number; totalPatients: number; newDoctors: number; newPatients: number;
  avgPatientAge: number; avgPatientsPerDoctor: number;
  recentDoctors: Doctor[]; recentPatients: Patient[];
}
export type ListParams = Record<string, string | number | undefined>;
