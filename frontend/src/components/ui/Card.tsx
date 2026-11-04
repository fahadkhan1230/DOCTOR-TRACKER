import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Skeleton } from './States';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-card ${className}`}>{children}</div>
);

export function StatCard({ label, value, icon: Icon, tone = 'blue', loading }:
  { label: string; value?: number | string; icon: LucideIcon; tone?: 'blue' | 'green' | 'amber'; loading?: boolean }) {
  const tones = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', amber: 'bg-amber-50 text-amber-700' };
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`rounded-lg p-3 ${tones[tone]}`}><Icon className="h-6 w-6" aria-hidden /></div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        {loading ? <Skeleton className="mt-1 h-7 w-16" /> : <p className="text-2xl font-semibold">{value ?? '–'}</p>}
      </div>
    </Card>
  );
}
