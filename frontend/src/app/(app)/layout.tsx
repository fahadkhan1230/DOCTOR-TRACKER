'use client';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/States';
import { useAuth } from '@/providers/AuthProvider';

/** Client-side route guard: the real enforcement is the backend (every API call requires the cookie). */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [loading, user, router]);
  if (loading || !user) return <div className="p-8"><Skeleton className="h-8 w-48" /></div>;
  return <AppShell>{children}</AppShell>;
}
