'use client';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FilterPanel, type FilterField } from '@/components/forms/FilterPanel';
import { DataTable, type Column } from '@/components/tables/DataTable';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { PAGE_SIZE } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import { useListState } from '@/hooks/useListState';
import { errorMessage } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useToast } from '@/providers/ToastProvider';
import { doctorMeta } from '@/services/doctors';
import * as api from '@/services/patients';
import type { Patient } from '@/types';

const INITIAL = { search: '', condition: '', doctorId: '', dateFrom: '', dateTo: '' };
const iconBtn = 'rounded p-1.5 text-slate-500 hover:bg-slate-100';
const doctorName = (p: Patient) => (typeof p.doctorId === 'string' ? '—' : p.doctorId?.name ?? '—');

export default function PatientsPage() {
  const toast = useToast();
  const list = useListState(INITIAL);
  const [toDelete, setToDelete] = useState<Patient | null>(null);
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useFetch(() => api.listPatients({ ...list.params, limit: PAGE_SIZE }), list.key);
  const { data: docs } = useFetch(doctorMeta, 'meta');
  const { data: conditions } = useFetch(api.patientConditions, 'conditions');

  const fields: FilterField[] = useMemo(() => [
    { type: 'select', key: 'condition', label: 'Condition', options: (conditions ?? []).map((c) => ({ value: c, label: c })) },
    { type: 'select', key: 'doctorId', label: 'Doctor', options: (docs?.doctors ?? []).map((d) => ({ value: d._id, label: d.name })) },
    { type: 'date', key: 'dateFrom', label: 'Created from' },
    { type: 'date', key: 'dateTo', label: 'Created to' },
  ], [conditions, docs]);

  const remove = async () => {
    if (!toDelete) return;
    setBusy(true);
    try { await api.deletePatient(toDelete._id); toast.success('Patient deleted'); setToDelete(null); reload(); }
    catch (e) { toast.error(errorMessage(e)); } finally { setBusy(false); }
  };

  const columns: Column<Patient>[] = [
    { header: 'Patient', cell: (p) => <span className="font-medium">{p.name}</span> },
    { header: 'Age', cell: (p) => p.age },
    { header: 'Gender', cell: (p) => p.gender },
    { header: 'Phone', cell: (p) => p.phone },
    { header: 'Condition', cell: (p) => p.condition },
    { header: 'Assigned doctor', cell: (p) => doctorName(p) },
    { header: 'Created', cell: (p) => formatDate(p.createdAt) },
    { header: 'Actions', cell: (p) => (
      <div className="flex gap-1">
        <Link href={`/patients/${p._id}`} aria-label={`View ${p.name}`} className={iconBtn}><Eye className="h-4 w-4" /></Link>
        <Link href={`/patients/${p._id}/edit`} aria-label={`Edit ${p.name}`} className={iconBtn}><Pencil className="h-4 w-4" /></Link>
        <button onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`} className={`${iconBtn} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
      </div>) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage all patients</p>
        <Link href="/patients/new" className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-900"><Plus className="h-4 w-4" />Add patient</Link>
      </div>
      <Card>
        <FilterPanel values={list.filters} onChange={list.setFilter} onReset={list.reset} fields={fields} searchPlaceholder="Search by name, phone or condition" />
        <DataTable columns={columns} rows={data?.data} rowKey={(p) => p._id} loading={loading} error={error} onRetry={reload}
          emptyTitle="No patients found" emptyHint="Try changing the search or filters, or add a new patient." />
        {data && <Pagination info={data.pagination} onPage={list.setPage} />}
      </Card>
      <ConfirmDialog open={!!toDelete} title="Delete patient" loading={busy} onConfirm={remove} onClose={() => setToDelete(null)}
        message={`Are you sure you want to delete ${toDelete?.name}? This cannot be undone.`} />
    </div>
  );
}
