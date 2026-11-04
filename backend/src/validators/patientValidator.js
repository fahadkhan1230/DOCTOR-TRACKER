import { z } from 'zod';
import { listQuery, optStr, phone } from './common.js';

const objectId = (msg) => z.string({ required_error: msg }).regex(/^[a-f\d]{24}$/i, msg);

export const patientSchema = z.object({
  name: z.string({ required_error: 'Patient name is required' }).trim().min(1, 'Patient name is required').max(100),
  age: z.coerce.number({ invalid_type_error: 'Age must be a number' }).int('Age must be a whole number').min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other'], { errorMap: () => ({ message: 'Select a valid gender' }) }),
  phone,
  condition: z.string({ required_error: 'Condition is required' }).trim().min(1, 'Condition is required').max(150),
  doctorId: objectId('Patient must be assigned to a valid doctor'),
});

export const patientListQuery = listQuery.extend({
  condition: optStr,
  doctorId: z.preprocess((v) => (v === '' ? undefined : v), objectId('Invalid doctor filter').optional()),
});
export const doctorPatientsQuery = listQuery.pick({ page: true, limit: true });
