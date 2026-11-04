'use client';
import { useParams, useRouter } from 'next/navigation';
import { PatientForm } from '@/components/patients/PatientForm';
import { Card } from '@/components/ui/Card';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { useFetch } from '@/hooks/useFetch';
import { useToast } from '@/providers/ToastProvider';
import { getPatient, updatePatient } from '@/services/patients';

export default function EditPatientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => getPatient(id), id);
  return (
    <Card className="mx-auto max-w-3xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Edit patient</h2>
      {loading && <Skeleton className="h-40 w-full" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <PatientForm submitLabel="Save changes" onCancel={() => router.back()}
          defaultValues={{ name: data.name, age: data.age, gender: data.gender, phone: data.phone, condition: data.condition,
            doctorId: typeof data.doctorId === 'string' ? data.doctorId : data.doctorId._id }}
          onSubmit={async (v) => { await updatePatient(id, v); toast.success('Patient updated'); router.push(`/patients/${id}`); }} />
      )}
    </Card>
  );
}
