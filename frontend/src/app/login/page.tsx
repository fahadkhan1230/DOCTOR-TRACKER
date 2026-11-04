'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { errorMessage } from '@/lib/api';
import { loginSchema, type LoginForm } from '@/lib/schemas';
import { useAuth } from '@/providers/AuthProvider';

function LoginPanel() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const expired = useSearchParams().get('expired');
  const [serverError, setServerError] = useState<string | null>(expired ? 'Session expired. Please log in again.' : null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  useEffect(() => { if (!loading && user) router.replace('/dashboard'); }, [loading, user, router]);

  const onSubmit = handleSubmit(async (v) => {
    setServerError(null);
    try { await login(v); router.replace('/dashboard'); } catch (e) { setServerError(errorMessage(e)); }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-card">
      <div className="text-center">
        <Stethoscope className="mx-auto h-10 w-10 text-navy-800" aria-hidden />
        <h1 className="mt-2 text-2xl font-semibold text-navy-900">Doctor Tracker</h1>
        <p className="text-sm text-slate-500">Sign in to the admin panel</p>
      </div>
      {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
      <Input label="Email" type="email" autoComplete="username" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
      <Button type="submit" className="w-full" loading={isSubmitting}>Sign in</Button>
    </form>
  );
}

export default function LoginPage() {
  return <div className="flex min-h-screen items-center justify-center bg-navy-50 p-4"><Suspense><LoginPanel /></Suspense></div>;
}
