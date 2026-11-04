import { z } from 'zod';

const emptyToUndef = (v) => (v === '' || v === null ? undefined : v);
export const optStr = z.preprocess(emptyToUndef, z.string().trim().max(150).optional());
export const optDate = z.preprocess(emptyToUndef, z.coerce.date({ invalid_type_error: 'Invalid date' }).optional());
export const phone = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .regex(/^\+?[0-9\s-]{7,15}$/, 'Invalid phone number');

export const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: optStr,
  dateFrom: optDate,
  dateTo: optDate,
});
