import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PageInfo } from '@/types';
import { Button } from './Button';

export function Pagination({ info, onPage }: { info: PageInfo; onPage: (p: number) => void }) {
  if (info.totalRecords === 0) return null;
  const from = (info.currentPage - 1) * info.limit + 1;
  const to = Math.min(info.currentPage * info.limit, info.totalRecords);
  return (
    <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-2 border-t px-4 py-3 text-sm text-slate-600 sm:flex-row">
      <span>Showing {from}–{to} of {info.totalRecords}</span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" aria-label="Previous page" disabled={info.currentPage <= 1} onClick={() => onPage(info.currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>Page {info.currentPage} of {info.totalPages}</span>
        <Button variant="secondary" aria-label="Next page" disabled={info.currentPage >= info.totalPages} onClick={() => onPage(info.currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
