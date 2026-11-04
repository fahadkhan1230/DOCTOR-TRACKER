'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PatientForm } from '@/components/patients/PatientForm';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/providers/ToastProvider';
import { createPatient } from '@/services/patients';

function NewPatient() {
  const router = useRouter();
  const toast = useToast();
  const doctorId = useSearchParams().get('doctorId') ?? '';
  return (
    <Card className="mx-auto max-w-3xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Add patient</h2>
      <PatientForm submitLabel="Create patient" defaultValues={{ doctorId }} onCancel={() => router.back()}
        onSubmit={async (v) => { await createPatient(v); toast.success('Patient created'); router.push(doctorId ? `/doctors/${doctorId}` : '/patients'); }} />
    </Card>
  );
}
export default function NewPatientPage() { return <Suspense><NewPatient /></Suspense>; }
