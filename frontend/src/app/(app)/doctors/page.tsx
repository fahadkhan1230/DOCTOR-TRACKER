'use client';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DeleteDoctorDialog } from '@/components/doctors/DeleteDoctorDialog';
import { FilterPanel, type FilterField } from '@/components/forms/FilterPanel';
import { DataTable, type Column } from '@/components/tables/DataTable';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { useListState } from '@/hooks/useListState';
import { formatDate } from '@/lib/format';
import { PAGE_SIZE } from '@/constants';
import * as api from '@/services/doctors';
import type { Doctor } from '@/types';

const INITIAL = { search: '', specialization: '', hospital: '', dateFrom: '', dateTo: '' };
const iconBtn = 'rounded p-1.5 text-slate-500 hover:bg-slate-100';

export default function DoctorsPage() {
  const list = useListState(INITIAL);
  const [toDelete, setToDelete] = useState<Doctor | null>(null);
  const { data, loading, error, reload } = useFetch(() => api.listDoctors({ ...list.params, limit: PAGE_SIZE }), list.key);
  const { data: meta } = useFetch(api.doctorMeta, 'meta');

  const fields: FilterField[] = useMemo(() => [
    { type: 'select', key: 'specialization', label: 'Specialization', options: (meta?.specializations ?? []).map((s) => ({ value: s, label: s })) },
    { type: 'select', key: 'hospital', label: 'Hospital', options: (meta?.hospitals ?? []).map((s) => ({ value: s, label: s })) },
    { type: 'date', key: 'dateFrom', label: 'Created from' },
    { type: 'date', key: 'dateTo', label: 'Created to' },
  ], [meta]);

  const columns: Column<Doctor>[] = [
    { header: 'Doctor', cell: (d) => <span className="font-medium">{d.name}</span> },
    { header: 'Specialization', cell: (d) => d.specialization },
    { header: 'Hospital', cell: (d) => d.hospital },
    { header: 'Phone', cell: (d) => d.phone },
    { header: 'Email', cell: (d) => d.email },
    { header: 'Patients', cell: (d) => <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{d.patientCount ?? 0}</span> },
    { header: 'Created', cell: (d) => formatDate(d.createdAt) },
    { header: 'Actions', cell: (d) => (
      <div className="flex gap-1">
        <Link href={`/doctors/${d._id}`} aria-label={`View ${d.name}`} className={iconBtn}><Eye className="h-4 w-4" /></Link>
        <Link href={`/doctors/${d._id}/edit`} aria-label={`Edit ${d.name}`} className={iconBtn}><Pencil className="h-4 w-4" /></Link>
        <button onClick={() => setToDelete(d)} aria-label={`Delete ${d.name}`} className={`${iconBtn} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
      </div>) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage all registered doctors</p>
        <Link href="/doctors/new" className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-900"><Plus className="h-4 w-4" />Add doctor</Link>
      </div>
      <Card>
        <FilterPanel values={list.filters} onChange={list.setFilter} onReset={list.reset} fields={fields} searchPlaceholder="Search by name, specialization, hospital or email" />
        <DataTable columns={columns} rows={data?.data} rowKey={(d) => d._id} loading={loading} error={error} onRetry={reload}
          emptyTitle="No doctors found" emptyHint="Try changing the search or filters, or add a new doctor." />
        {data && <Pagination info={data.pagination} onPage={list.setPage} />}
      </Card>
      <DeleteDoctorDialog doctor={toDelete} onClose={() => setToDelete(null)} onDeleted={() => { setToDelete(null); reload(); }} />
    </div>
  );
}
