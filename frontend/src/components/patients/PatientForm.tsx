'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { GENDERS } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import { errorMessage, fieldErrors } from '@/lib/api';
import { patientSchema, type PatientForm as Values } from '@/lib/schemas';
import { doctorMeta } from '@/services/doctors';

interface Props { defaultValues?: Partial<Values>; submitLabel: string; onSubmit: (v: Values) => Promise<void>; onCancel: () => void }

export function PatientForm({ defaultValues, submitLabel, onSubmit, onCancel }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const { data: meta, loading: loadingDocs } = useFetch(doctorMeta, 'meta');
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(patientSchema),
    defaultValues: { name: '', phone: '', condition: '', gender: undefined, doctorId: '', ...defaultValues },
  });

  const submit = handleSubmit(async (v) => {
    setFormError(null);
    try { await onSubmit(v); } catch (e) {
      fieldErrors(e).forEach((f) => setError(f.field as keyof Values, { message: f.message }));
      setFormError(errorMessage(e));
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Age" type="number" min={0} max={120} error={errors.age?.message} {...register('age')} />
        <Select label="Gender" error={errors.gender?.message} {...register('gender')}>
          <option value="">Select…</option>
          {GENDERS.map((g) => <option key={g}>{g}</option>)}
        </Select>
        <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
        <Input label="Condition" error={errors.condition?.message} {...register('condition')} />
        <Select label="Assigned doctor" disabled={loadingDocs} error={errors.doctorId?.message} {...register('doctorId')}>
          <option value="">{loadingDocs ? 'Loading doctors…' : 'Select a doctor…'}</option>
          {meta?.doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
