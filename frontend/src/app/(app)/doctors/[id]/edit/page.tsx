'use client';
import { useParams, useRouter } from 'next/navigation';
import { DoctorForm } from '@/components/doctors/DoctorForm';
import { Card } from '@/components/ui/Card';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { useFetch } from '@/hooks/useFetch';
import { useToast } from '@/providers/ToastProvider';
import { getDoctor, updateDoctor } from '@/services/doctors';

export default function EditDoctorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => getDoctor(id), id);
  return (
    <Card className="mx-auto max-w-3xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Edit doctor</h2>
      {loading && <Skeleton className="h-40 w-full" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <DoctorForm submitLabel="Save changes" onCancel={() => router.back()}
          defaultValues={{ name: data.name, specialization: data.specialization, hospital: data.hospital, phone: data.phone, email: data.email }}
          onSubmit={async (v) => { await updateDoctor(id, v); toast.success('Doctor updated'); router.push(`/doctors/${id}`); }} />
      )}
    </Card>
  );
}
