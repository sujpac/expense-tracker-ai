'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { Expense } from '@/types/expense'

export default function TrendChart({ expenses }: { expenses: Expense[] }) {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      total: 0,
    }
  })

  expenses.forEach(e => {
    const m = months.find(mo => mo.key === e.date.slice(0, 7))
    if (m) m.total += e.amount
  })

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={months} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
          width={48}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Total']}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
          cursor={{ fill: '#F8FAFC' }}
        />
        <Bar dataKey="total" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={52} />
      </BarChart>
    </ResponsiveContainer>
  )
}
