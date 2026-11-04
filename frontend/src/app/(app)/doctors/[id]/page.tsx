// 'use client';
// import { Mail, Pencil, Phone, Plus, Building2, Stethoscope } from 'lucide-react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useState } from 'react';
// import { DataTable, type Column } from '@/components/tables/DataTable';
// import { Card } from '@/components/ui/Card';
// import { Pagination } from '@/components/ui/Pagination';
// import { ErrorState, Skeleton } from '@/components/ui/States';
// import { useFetch } from '@/hooks/useFetch';
// import { errorMessage } from '@/lib/api';
// import { formatDate } from '@/lib/format';
// import { useToast } from '@/providers/ToastProvider';
// import * as doctors from '@/services/doctors';
// import * as patients from '@/services/patients';
// import type { Patient } from '@/types';
// import { ConfirmDialog } from '@/components/ui/Modal';

// export default function DoctorDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const toast = useToast();
//   const [page, setPage] = useState(1);
//   const doc = useFetch(() => doctors.getDoctor(id), id);
//   const meta = useFetch(doctors.doctorMeta, 'meta');
//   const list = useFetch(() => doctors.doctorPatients(id, { page, limit: 10 }), `${id}-${page}`);

//   // A patient must always have a doctor, so "removing" from this list means moving to another doctor.
//   const move = async (p: Patient, doctorId: string) => {
//     if (!doctorId) return;
//     try {
//       await patients.updatePatient(p._id, { name: p.name, age: p.age, gender: p.gender, phone: p.phone, condition: p.condition, doctorId });
//       toast.success(`${p.name} moved to another doctor`);
//       list.reload(); doc.reload();
//     } catch (e) { toast.error(errorMessage(e)); }
//   };

// const [toDelete, setToDelete] = useState<Patient | null>(null);
// const removePatient = async () => {
//   if (!toDelete) return;
//   try {
//     await patients.deletePatient(toDelete._id);
//     toast.success('Patient deleted');
//     setToDelete(null); list.reload(); doc.reload();
//   } catch (e) { toast.error(errorMessage(e)); }

  
// };



//   const columns: Column<Patient>[] = [
//     { header: 'Patient', cell: (p) => <Link href={`/patients/${p._id}`} className="font-medium text-blue-700 hover:underline">{p.name}</Link> },
//     { header: 'Age', cell: (p) => p.age },
//     { header: 'Gender', cell: (p) => p.gender },
//     { header: 'Condition', cell: (p) => p.condition },
//     { header: 'Added', cell: (p) => formatDate(p.createdAt) },
//     { header: 'Remove from this doctor', cell: (p) => (
//       <select aria-label={`Move ${p.name} to another doctor`} defaultValue="" onChange={(e) => move(p, e.target.value)}
//         className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs">
//         <option value="">Move to…</option>
//         {meta.data?.doctors.filter((d) => d._id !== id).map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
//       </select>) },
//   ];

//   if (doc.loading) return <Skeleton className="h-40 w-full" />;
//   if (doc.error || !doc.data) return <Card><ErrorState message={doc.error ?? 'Not found'} onRetry={doc.reload} /></Card>;
//   const d = doc.data;

//   return (
//     <div className="space-y-4">
//       <Card className="p-6">
//         <div className="flex flex-wrap items-start justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-semibold">{d.name}</h2>
//             <p className="text-sm text-slate-500">Added {formatDate(d.createdAt)} · {d.patientCount ?? 0} patient(s)</p>
//           </div>
//           <Link href={`/doctors/${id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"><Pencil className="h-4 w-4" />Edit</Link>
//         </div>
//         <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
//           <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-slate-400" aria-hidden /><dt className="sr-only">Specialization</dt><dd>{d.specialization}</dd></div>
//           <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" aria-hidden /><dt className="sr-only">Hospital</dt><dd>{d.hospital}</dd></div>
//           <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" aria-hidden /><dt className="sr-only">Phone</dt><dd>{d.phone}</dd></div>
//           <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" aria-hidden /><dt className="sr-only">Email</dt><dd>{d.email}</dd></div>
//         </dl>
//       </Card>
//       <Card>
//         <div className="flex items-center justify-between border-b p-4">
//           <h3 className="font-semibold">Associated patients</h3>
//           <Link href={`/patients/new?doctorId=${id}`} className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-1.5 text-sm text-white hover:bg-navy-900"><Plus className="h-4 w-4" />Add patient</Link>
//         </div>
//         <DataTable columns={columns} rows={list.data?.data} rowKey={(p) => p._id} loading={list.loading} error={list.error} onRetry={list.reload}
//           emptyTitle="No patients yet" emptyHint="Add the first patient under this doctor." />
//         {list.data && <Pagination info={list.data.pagination} onPage={setPage} />}
        
//       </Card>
//     </div>
//   );
// }






'use client';

import {
  Mail,
  Pencil,
  Phone,
  Plus,
  Building2,
  Stethoscope,
  Trash2,
} from 'lucide-react';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { DataTable, type Column } from '@/components/tables/DataTable';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { ConfirmDialog } from '@/components/ui/Modal';

import { useFetch } from '@/hooks/useFetch';
import { errorMessage } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useToast } from '@/providers/ToastProvider';

import * as doctors from '@/services/doctors';
import * as patients from '@/services/patients';

import type { Patient } from '@/types';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const toast = useToast();

  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Patient | null>(null);

  // Fetch doctor details
  const doc = useFetch(() => doctors.getDoctor(id), id);

  // Fetch doctor metadata
  const meta = useFetch(doctors.doctorMeta, 'meta');

  // Fetch associated patients
  const list = useFetch(
    () => doctors.doctorPatients(id, { page, limit: 10 }),
    `${id}-${page}`
  );

  // Move patient to another doctor
  const move = async (p: Patient, doctorId: string) => {
    if (!doctorId) return;

    try {
      await patients.updatePatient(p._id, {
        name: p.name,
        age: p.age,
        gender: p.gender,
        phone: p.phone,
        condition: p.condition,
        doctorId,
      });

      toast.success(`${p.name} moved to another doctor`);

      list.reload();
      doc.reload();

    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  // Delete patient
  const removePatient = async () => {
    if (!toDelete) return;

    try {
      await patients.deletePatient(toDelete._id);

      toast.success('Patient deleted');

      setToDelete(null);

      list.reload();
      doc.reload();

    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  // Patient table columns
  const columns: Column<Patient>[] = [
    {
      header: 'Patient',
      cell: (p) => (
        <Link
          href={`/patients/${p._id}`}
          className="font-medium text-blue-700 hover:underline"
        >
          {p.name}
        </Link>
      ),
    },

    {
      header: 'Age',
      cell: (p) => p.age,
    },

    {
      header: 'Gender',
      cell: (p) => p.gender,
    },

    {
      header: 'Condition',
      cell: (p) => p.condition,
    },

    {
      header: 'Added',
      cell: (p) => formatDate(p.createdAt),
    },

    {
      header: 'Remove from this doctor',
      cell: (p) => (
        <select
          aria-label={`Move ${p.name} to another doctor`}
          defaultValue=""
          onChange={(e) => move(p, e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
        >
          <option value="">Move to…</option>

          {meta.data?.doctors
            .filter((d) => d._id !== id)
            .map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
        </select>
      ),
    },

    // Delete button
    {
      header: 'Delete',
      cell: (p) => (
        <button
          onClick={() => setToDelete(p)}
          aria-label={`Delete ${p.name}`}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  // Loading state
  if (doc.loading) {
    return <Skeleton className="h-40 w-full" />;
  }

  // Error state
  if (doc.error || !doc.data) {
    return (
      <Card>
        <ErrorState
          message={doc.error ?? 'Not found'}
          onRetry={doc.reload}
        />
      </Card>
    );
  }

  const d = doc.data;

  return (
    <div className="space-y-4">

      {/* Doctor Information */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>
            <h2 className="text-xl font-semibold">
              {d.name}
            </h2>

            <p className="text-sm text-slate-500">
              Added {formatDate(d.createdAt)} · {d.patientCount ?? 0} patient(s)
            </p>
          </div>

          <Link
            href={`/doctors/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>

        </div>

        {/* Doctor Details */}
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">

          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-slate-400" aria-hidden />
            <dt className="sr-only">Specialization</dt>
            <dd>{d.specialization}</dd>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" aria-hidden />
            <dt className="sr-only">Hospital</dt>
            <dd>{d.hospital}</dd>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" aria-hidden />
            <dt className="sr-only">Phone</dt>
            <dd>{d.phone}</dd>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" aria-hidden />
            <dt className="sr-only">Email</dt>
            <dd>{d.email}</dd>
          </div>

        </dl>
      </Card>

      {/* Associated Patients */}
      <Card>

        <div className="flex items-center justify-between border-b p-4">

          <h3 className="font-semibold">
            Associated patients
          </h3>

          <Link
            href={`/patients/new?doctorId=${id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-1.5 text-sm text-white hover:bg-navy-900"
          >
            <Plus className="h-4 w-4" />
            Add patient
          </Link>

        </div>

        {/* Patients Data Table */}
        <DataTable
          columns={columns}
          rows={list.data?.data}
          rowKey={(p) => p._id}
          loading={list.loading}
          error={list.error}
          onRetry={list.reload}
          emptyTitle="No patients yet"
          emptyHint="Add the first patient under this doctor."
        />

        {/* Pagination */}
        {list.data && (
          <Pagination
            info={list.data.pagination}
            onPage={setPage}
          />
        )}

      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete patient"
        message={`Delete ${toDelete?.name}?`}
        onConfirm={removePatient}
        onClose={() => setToDelete(null)}
      />

    </div>
  );
}
