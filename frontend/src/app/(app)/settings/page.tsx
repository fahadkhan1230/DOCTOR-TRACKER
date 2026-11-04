'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/providers/AuthProvider';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <Card className="mx-auto max-w-xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Admin profile</h2>
      <dl className="space-y-3 text-sm">
        <div><dt className="text-slate-500">Name</dt><dd className="font-medium">{user?.name}</dd></div>
        <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{user?.email}</dd></div>
      </dl>
      <Button variant="danger" className="mt-6" onClick={async () => { await logout(); router.replace('/login'); }}>Log out</Button>
    </Card>
  );
}
