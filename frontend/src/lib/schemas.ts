import { z } from 'zod';

const phone = z.string().trim().min(1, 'Phone number is required').regex(/^\+?[0-9\s-]{7,15}$/, 'Invalid phone number');

export const doctorSchema = z.object({
  name: z.string().trim().min(1, 'Doctor name is required').max(100),
  specialization: z.string().trim().min(1, 'Specialization is required').max(100),
  hospital: z.string().trim().min(1, 'Hospital is required').max(150),
  phone,
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
});
export type DoctorForm = z.infer<typeof doctorSchema>;

export const patientSchema = z.object({
  name: z.string().trim().min(1, 'Patient name is required').max(100),
  age: z.coerce.number({ invalid_type_error: 'Age is required' }).int('Age must be a whole number').min(0, 'Age must be 0 or more').max(120, 'Age must be 120 or less'),
  gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Select a gender' }) }),
  phone,
  condition: z.string().trim().min(1, 'Condition is required').max(150),
  doctorId: z.string().min(1, 'Patient must be assigned to a valid doctor'),
});
export type PatientForm = z.infer<typeof patientSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginForm = z.infer<typeof loginSchema>;
