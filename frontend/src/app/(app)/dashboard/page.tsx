'use client';
import { Activity, Stethoscope, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { DashboardCharts } from '@/components/charts/DashboardCharts';
import { Card, StatCard } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useFetch } from '@/hooks/useFetch';
import { formatDate } from '@/lib/format';
import { getStats } from '@/services/dashboard';

export default function DashboardPage() {
  const { data: s, loading, error, reload } = useFetch(getStats, 'stats');
  if (error) return <Card><ErrorState message={error} onRetry={reload} /></Card>;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total doctors" value={s?.totalDoctors} icon={Stethoscope} loading={loading} />
        <StatCard label="Total patients" value={s?.totalPatients} icon={Users} tone="green" loading={loading} />
        <StatCard label="New doctors (30 days)" value={s?.newDoctors} icon={UserPlus} tone="amber" loading={loading} />
        <StatCard label="New patients (30 days)" value={s?.newPatients} icon={UserPlus} tone="amber" loading={loading} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Avg. patients per doctor" value={s?.avgPatientsPerDoctor} icon={Activity} loading={loading} />
        <StatCard label="Avg. patient age" value={s?.avgPatientAge} icon={Activity} tone="green" loading={loading} />
      </div>
      <DashboardCharts />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 font-semibold">Recent doctors</h3>
          {s?.recentDoctors.length === 0 && <EmptyState title="No doctors yet" />}
          <ul className="divide-y">
            {s?.recentDoctors.map((d) => (
              <li key={d._id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/doctors/${d._id}`} className="font-medium text-blue-700 hover:underline">{d.name}</Link>
                <span className="text-slate-500">{d.specialization} · {formatDate(d.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold">Recent patients</h3>
          {s?.recentPatients.length === 0 && <EmptyState title="No patients yet" />}
          <ul className="divide-y">
            {s?.recentPatients.map((p) => (
              <li key={p._id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/patients/${p._id}`} className="font-medium text-blue-700 hover:underline">{p.name}</Link>
                <span className="text-slate-500">{p.condition} · {formatDate(p.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
