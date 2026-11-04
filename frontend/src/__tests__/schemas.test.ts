import { describe, expect, it } from 'vitest';
import { doctorSchema, loginSchema, patientSchema } from '@/lib/schemas';

const msgs = (r: { success: boolean; error?: { issues: { message: string }[] } }) => r.error?.issues.map((i) => i.message) ?? [];

describe('form schemas', () => {
  it('doctor: required + email + phone messages', () => {
    const r = doctorSchema.safeParse({ name: '', specialization: 'x', hospital: 'y', phone: '', email: 'bad' });
    expect(msgs(r)).toEqual(expect.arrayContaining(['Doctor name is required', 'Phone number is required', 'Invalid email address']));
  });
  it('doctor: accepts valid input', () => {
    expect(doctorSchema.safeParse({ name: 'Dr A', specialization: 'Cardiology', hospital: 'City', phone: '+8801700000000', email: 'a@b.com' }).success).toBe(true);
  });
  it('patient: age coercion and doctor required', () => {
    const ok = patientSchema.safeParse({ name: 'P', age: '34', gender: 'Male', phone: '01700000000', condition: 'Flu', doctorId: 'abc' });
    expect(ok.success && ok.data.age).toBe(34);
    expect(msgs(patientSchema.safeParse({ name: 'P', age: 34, gender: 'Male', phone: '01700000000', condition: 'Flu', doctorId: '' })))
      .toContain('Patient must be assigned to a valid doctor');
  });
  it('login requires both fields', () => {
    expect(msgs(loginSchema.safeParse({ email: '', password: '' }))).toEqual(expect.arrayContaining(['Email is required', 'Password is required']));
  });
});
