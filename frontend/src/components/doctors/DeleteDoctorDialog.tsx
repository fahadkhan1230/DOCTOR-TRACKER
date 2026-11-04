'use client';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Field';
import { errorMessage } from '@/lib/api';
import * as api from '@/services/doctors';
import { useToast } from '@/providers/ToastProvider';
import { useFetch } from '@/hooks/useFetch';
import type { Doctor } from '@/types';

/** Doctors with patients must hand them over to another doctor first (no orphans, no silent cascade). */
export function DeleteDoctorDialog({ doctor, onClose, onDeleted }: { doctor: Doctor | null; onClose: () => void; onDeleted: () => void }) {
  const toast = useToast();
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const needsTarget = (doctor?.patientCount ?? 0) > 0;
  const { data: meta } = useFetch(() => (needsTarget ? api.doctorMeta() : Promise.resolve(null)), doctor?._id ?? '');

  const confirm = async () => {
    if (!doctor) return;
    if (needsTarget && !target) { toast.error('Choose a doctor to take over the patients'); return; }
    setBusy(true);
    try {
      await api.deleteDoctor(doctor._id, target || undefined);
      toast.success('Doctor deleted');
      setTarget('');
      onDeleted();
    } catch (e) { toast.error(errorMessage(e)); } finally { setBusy(false); }
  };

  return (
    <ConfirmDialog open={!!doctor} title="Delete doctor" loading={busy} onConfirm={confirm} onClose={onClose}
      message={needsTarget
        ? `${doctor?.name} has ${doctor?.patientCount} patient(s). Reassign them before deleting.`
        : `Are you sure you want to delete ${doctor?.name}? This cannot be undone.`}>
      {needsTarget && (
        <Select label="Reassign patients to" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="">Select a doctor…</option>
          {meta?.doctors.filter((d) => d._id !== doctor?._id).map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </Select>
      )}
    </ConfirmDialog>
  );
}
