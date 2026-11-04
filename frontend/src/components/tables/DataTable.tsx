import type { ReactNode } from 'react';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';

export interface Column<T> { header: string; cell: (row: T) => ReactNode; className?: string }

interface Props<T> {
  columns: Column<T>[]; rows?: T[]; rowKey: (r: T) => string; loading?: boolean; error?: string | null;
  onRetry?: () => void; emptyTitle: string; emptyHint?: string; emptyAction?: ReactNode;
}

export function DataTable<T>({ columns, rows, rowKey, loading, error, onRetry, emptyTitle, emptyHint, emptyAction }: Props<T>) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!loading && rows?.length === 0) return <EmptyState title={emptyTitle} hint={emptyHint} action={emptyAction} />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>{columns.map((c) => <th key={c.header} scope="col" className={`px-4 py-3 font-medium ${c.className ?? ''}`}>{c.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading && !rows?.length
            ? Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>{columns.map((c) => <td key={c.header} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
              ))
            : rows?.map((r) => (
                <tr key={rowKey(r)} className={`hover:bg-slate-50 ${loading ? 'opacity-60' : ''}`}>
                  {columns.map((c) => <td key={c.header} className={`px-4 py-3 ${c.className ?? ''}`}>{c.cell(r)}</td>)}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
