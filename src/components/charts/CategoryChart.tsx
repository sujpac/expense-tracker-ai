'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_CONFIG } from '@/lib/categories'
import { formatCurrency } from '@/lib/utils'
import type { Expense, Category } from '@/types/expense'

export default function CategoryChart({ expenses }: { expenses: Expense[] }) {
  const totals = expenses.reduce(
    (acc, e) => { acc[e.category] = (acc[e.category] ?? 0) + e.amount; return acc },
    {} as Partial<Record<Category, number>>
  )

  const data = (Object.entries(totals) as [Category, number][])
    .map(([category, value]) => ({
      category,
      name: CATEGORY_CONFIG[category].label,
      value,
      color: CATEGORY_CONFIG[category].color,
    }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((s, d) => s + d.value, 0)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No expenses this month
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center">
      <div className="w-44 h-44 flex-shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={70} paddingAngle={3} dataKey="value">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xs text-gray-400">Total</div>
            <div className="text-sm font-bold text-gray-800">{formatCurrency(total)}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 w-full">
        {data.map(item => (
          <div key={item.category} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-gray-400 w-8 text-right">
                {Math.round((item.value / total) * 100)}%
              </span>
              <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                {formatCurrency(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
