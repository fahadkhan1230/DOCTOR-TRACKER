'use client';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFetch } from '@/hooks/useFetch';
import * as api from '@/services/dashboard';
import { ChartCard } from './ChartCard';

const COLORS = ['#1e4a8a', '#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

export function DashboardCharts() {
  const perDoctor = useFetch(api.patientsPerDoctor, 'pd');
  const monthly = useFetch(api.monthlyStats, 'm');
  const spec = useFetch(api.specializationStats, 's');

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Patients per doctor" {...perDoctor} empty={!perDoctor.data?.length} onRetry={perDoctor.reload}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={perDoctor.data ?? []} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={55} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="patients" fill="#1e4a8a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Monthly registrations (last 6 months)" {...monthly} empty={!monthly.data?.some((m) => m.patients || m.doctors)} onRetry={monthly.reload}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly.data ?? []} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="doctors" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="lg:col-span-2">
        <ChartCard title="Doctor specialization distribution" {...spec} empty={!spec.data?.length} onRetry={spec.reload}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={spec.data ?? []} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2} label>
                {(spec.data ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
