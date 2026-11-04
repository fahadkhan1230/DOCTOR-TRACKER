import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from '@/components/tables/DataTable';
import { Pagination } from '@/components/ui/Pagination';

describe('Pagination', () => {
  const info = { currentPage: 2, limit: 10, totalRecords: 25, totalPages: 3 };
  it('shows range and navigates', () => {
    const onPage = vi.fn();
    render(<Pagination info={info} onPage={onPage} />);
    expect(screen.getByText('Showing 11–20 of 25')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Next page'));
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onPage).toHaveBeenNthCalledWith(1, 3);
    expect(onPage).toHaveBeenNthCalledWith(2, 1);
  });
  it('disables prev on first page', () => {
    render(<Pagination info={{ ...info, currentPage: 1 }} onPage={() => {}} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });
});

describe('DataTable states', () => {
  const cols = [{ header: 'Name', cell: (r: { n: string }) => r.n }];
  it('renders rows', () => {
    render(<DataTable columns={cols} rows={[{ n: 'Dr Rahman' }]} rowKey={(r) => r.n} emptyTitle="none" />);
    expect(screen.getByText('Dr Rahman')).toBeInTheDocument();
  });
  it('renders empty state', () => {
    render(<DataTable columns={cols} rows={[]} rowKey={(r) => r.n} emptyTitle="No doctors found" />);
    expect(screen.getByText('No doctors found')).toBeInTheDocument();
  });
  it('renders error with retry', () => {
    const retry = vi.fn();
    render(<DataTable columns={cols} error="Boom" onRetry={retry} rowKey={() => 'x'} emptyTitle="" />);
    fireEvent.click(screen.getByText('Try again'));
    expect(retry).toHaveBeenCalled();
  });
});
