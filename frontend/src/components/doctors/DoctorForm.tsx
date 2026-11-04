'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { errorMessage, fieldErrors } from '@/lib/api';
import { doctorSchema, type DoctorForm as Values } from '@/lib/schemas';

interface Props { defaultValues?: Values; submitLabel: string; onSubmit: (v: Values) => Promise<void>; onCancel: () => void }
const empty: Values = { name: '', specialization: '', hospital: '', phone: '', email: '' };

export function DoctorForm({ defaultValues = empty, submitLabel, onSubmit, onCancel }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<Values>({ resolver: zodResolver(doctorSchema), defaultValues });

  const submit = handleSubmit(async (v) => {
    setFormError(null);
    try { await onSubmit(v); } catch (e) {
      const fe = fieldErrors(e);
      fe.forEach((f) => setError(f.field as keyof Values, { message: f.message }));
      setFormError(errorMessage(e));
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Specialization" error={errors.specialization?.message} {...register('specialization')} />
        <Input label="Hospital" error={errors.hospital?.message} {...register('hospital')} />
        <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
