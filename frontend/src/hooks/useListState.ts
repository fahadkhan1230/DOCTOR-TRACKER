'use client';
import { useCallback, useState } from 'react';
import { useDebounce } from './useDebounce';

/** Shared filter + page state for list screens. Any filter change resets to page 1. */
export function useListState(initial: Record<string, string>) {
  const [filters, setFilters] = useState(initial);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search ?? '');
  const setFilter = useCallback((k: string, v: string) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }, []);
  const reset = useCallback(() => { setFilters(initial); setPage(1); }, [initial]);
  const params = { ...filters, search: debouncedSearch, page };
  return { filters, setFilter, reset, page, setPage, params, key: JSON.stringify(params) };
}
