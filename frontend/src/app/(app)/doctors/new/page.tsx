'use client';
import { useRouter } from 'next/navigation';
import { DoctorForm } from '@/components/doctors/DoctorForm';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/providers/ToastProvider';
import { createDoctor } from '@/services/doctors';

export default function NewDoctorPage() {
  const router = useRouter();
  const toast = useToast();
  return (
    <Card className="mx-auto max-w-3xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Add doctor</h2>
      <DoctorForm submitLabel="Create doctor" onCancel={() => router.back()}
        onSubmit={async (v) => { const d = await createDoctor(v); toast.success('Doctor created'); router.push(`/doctors/${d._id}`); }} />
    </Card>
  );
}
