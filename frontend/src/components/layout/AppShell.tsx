'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronRight, LayoutDashboard, LogOut, Menu, Settings, Stethoscope, Users, UserRound, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { NAV } from '@/constants';
import { useAuth } from '@/providers/AuthProvider';

const icons = { dashboard: LayoutDashboard, doctors: Stethoscope, patients: Users, settings: Settings };
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const crumbs = pathname.split('/').filter(Boolean);
  const title = NAV.find((n) => pathname.startsWith(n.href))?.label ?? 'Doctor Tracker';

  const onLogout = async () => { await logout(); router.replace('/login'); };

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900 text-slate-200">
      <div className="flex h-16 items-center gap-2 px-5 text-lg font-semibold text-white">
        <Stethoscope className="h-6 w-6 text-blue-400" aria-hidden /> Doctor Tracker
      </div>
      <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((n) => {
          const Icon = icons[n.icon];
          const active = pathname === n.href || pathname.startsWith(n.href + '/');
          return (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? 'bg-blue-600 text-white' : 'hover:bg-navy-800'}`}>
              <Icon className="h-5 w-5" aria-hidden /> {n.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={onLogout} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-navy-800">
        <LogOut className="h-5 w-5" aria-hidden /> Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">
            {sidebar}
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-2 top-4 text-white"><X className="h-5 w-5" /></button>
          </aside>
        </div>
      )}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white px-4 sm:px-6">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded p-2 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{title}</h1>
          <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-slate-500 sm:flex">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
                {/^[a-f\d]{24}$/i.test(c) ? 'Details' : titleCase(c)}
              </span>
            ))}
          </nav>
        </div>
        <button aria-label="Notifications" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><Bell className="h-5 w-5" /></button>
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-navy-700"><UserRound className="h-5 w-5" aria-hidden /></span>
          <div className="hidden text-sm leading-tight sm:block">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
