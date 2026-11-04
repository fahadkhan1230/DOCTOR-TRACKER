'use client';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { useFetch } from '@/hooks/useFetch';
import { formatDate } from '@/lib/format';
import { getPatient } from '@/services/patients';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: p, loading, error, reload } = useFetch(() => getPatient(id), id);
  if (loading) return <Skeleton className="h-40 w-full" />;
  if (error || !p) return <Card><ErrorState message={error ?? 'Not found'} onRetry={reload} /></Card>;
  const doc = typeof p.doctorId === 'string' ? null : p.doctorId;
  const rows: [string, React.ReactNode][] = [
    ['Age', p.age], ['Gender', p.gender], ['Phone', p.phone], ['Condition', p.condition],
    ['Assigned doctor', doc ? <Link href={`/doctors/${doc._id}`} className="text-blue-700 hover:underline">{doc.name}</Link> : '—'],
    ['Registered', formatDate(p.createdAt)], ['Last updated', formatDate(p.updatedAt)],
  ];
  return (
    <Card className="mx-auto max-w-3xl p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold">{p.name}</h2>
        <Link href={`/patients/${id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"><Pencil className="h-4 w-4" />Edit</Link>
      </div>
      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        {rows.map(([k, v]) => <div key={k}><dt className="text-slate-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}
      </dl>
    </Card>
  );
}
