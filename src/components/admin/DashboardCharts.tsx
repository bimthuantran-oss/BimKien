'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

export function ViewsLineChart({ data }: { data: { date: string; views: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9AA1AE" />
        <YAxis tick={{ fontSize: 11 }} stroke="#9AA1AE" allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #E5E7EB' }} />
        <Line type="monotone" dataKey="views" stroke="#FF6B1A" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopBarChart({ data, dataKey = 'value' }: { data: { name: string; value: number }[]; dataKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9AA1AE" allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} stroke="#9AA1AE" />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #E5E7EB' }} />
        <Bar dataKey={dataKey} fill="#FF6B1A" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
