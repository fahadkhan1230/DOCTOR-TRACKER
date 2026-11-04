import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';

const base = 'w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-600 disabled:bg-slate-50';

interface Common { label?: string; error?: string }

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Common>(
  function Input({ label, error, className = '', ...p }, ref) {
    const id = useId();
    return (
      <div>
        {label && <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>}
        <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined}
          className={`${base} ${error ? 'border-red-500' : 'border-slate-300'} ${className}`} {...p} />
        {error && <p id={`${id}-e`} role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & Common>(
  function Select({ label, error, className = '', children, ...p }, ref) {
    const id = useId();
    return (
      <div>
        {label && <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>}
        <select ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined}
          className={`${base} ${error ? 'border-red-500' : 'border-slate-300'} ${className}`} {...p}>
          {children}
        </select>
        {error && <p id={`${id}-e`} role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
