'use client';
import { Search, X } from 'lucide-react';
import { Input, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export type FilterField =
  | { type: 'select'; key: string; label: string; options: { value: string; label: string }[] }
  | { type: 'date'; key: string; label: string };

interface Props {
  values: Record<string, string>; onChange: (key: string, value: string) => void; onReset: () => void;
  searchPlaceholder: string; fields: FilterField[];
}

export function FilterPanel({ values, onChange, onReset, searchPlaceholder, fields }: Props) {
  const dirty = Object.values(values).some(Boolean);
  return (
    <div className="space-y-3 border-b p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input type="search" aria-label="Search" placeholder={searchPlaceholder} value={values.search ?? ''}
          onChange={(e) => onChange('search', e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-600" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((f) =>
          f.type === 'select' ? (
            <Select key={f.key} label={f.label} value={values[f.key] ?? ''} onChange={(e) => onChange(f.key, e.target.value)}>
              <option value="">All</option>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          ) : (
            <Input key={f.key} type="date" label={f.label} value={values[f.key] ?? ''} onChange={(e) => onChange(f.key, e.target.value)} />
          ),
        )}
      </div>
      {dirty && <Button variant="ghost" onClick={onReset}><X className="h-4 w-4" />Clear filters</Button>}
    </div>
  );
}
