import { z } from 'zod';
import { listQuery, optStr, phone } from './common.js';

const req = (label, max = 100) =>
  z.string({ required_error: `${label} is required` }).trim().min(1, `${label} is required`).max(max);

// Unknown keys are stripped by zod, which prevents mass assignment.
export const doctorSchema = z.object({
  name: req('Doctor name'),
  specialization: req('Specialization'),
  hospital: req('Hospital', 150),
  phone,
  email: z.string({ required_error: 'Email is required' }).trim().toLowerCase().email('Invalid email address'),
});

export const doctorListQuery = listQuery.extend({ specialization: optStr, hospital: optStr });
export const deleteDoctorQuery = z.object({ reassignTo: z.string().regex(/^[a-f\d]{24}$/i).optional() });
