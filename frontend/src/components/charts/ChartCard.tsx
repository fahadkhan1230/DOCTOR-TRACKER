import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';

export function ChartCard({ title, loading, error, empty, onRetry, children }:
  { title: string; loading: boolean; error: string | null; empty: boolean; onRetry: () => void; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="h-72">
        {loading ? <Skeleton className="h-full w-full" /> : error ? <ErrorState message={error} onRetry={onRetry} /> : empty ? <EmptyState title="No data yet" /> : children}
      </div>
    </Card>
  );
}
