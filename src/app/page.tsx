'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { DollarSign, Calendar, TrendingUp, TrendingDown, BarChart2, ArrowRight, Hash } from 'lucide-react'
import { useExpenses } from '@/context/ExpenseContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CATEGORY_CONFIG } from '@/lib/categories'
import CategoryBadge from '@/components/CategoryBadge'
import CategoryChart from '@/components/charts/CategoryChart'
import TrendChart from '@/components/charts/TrendChart'
import type { Category } from '@/types/expense'

export default function DashboardPage() {
  const { expenses, isLoaded } = useExpenses()

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const stats = useMemo(() => {
    const thisMonth = expenses.filter(e => {
      const [y, m] = e.date.split('-').map(Number)
      return y === currentYear && m === currentMonth
    })
    const lastMonthNum = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
    const lastMonth = expenses.filter(e => {
      const [y, m] = e.date.split('-').map(Number)
      return y === lastMonthYear && m === lastMonthNum
    })

    const thisMonthTotal = thisMonth.reduce((s, e) => s + e.amount, 0)
    const lastMonthTotal = lastMonth.reduce((s, e) => s + e.amount, 0)
    const ytdTotal = expenses
      .filter(e => e.date.startsWith(String(currentYear)))
      .reduce((s, e) => s + e.amount, 0)

    const categoryTotals = thisMonth.reduce(
      (acc, e) => { acc[e.category] = (acc[e.category] ?? 0) + e.amount; return acc },
      {} as Partial<Record<Category, number>>
    )
    const topEntry = (Object.entries(categoryTotals) as [Category, number][]).sort((a, b) => b[1] - a[1])[0]

    return {
      thisMonthTotal,
      lastMonthTotal,
      ytdTotal,
      thisMonthCount: thisMonth.length,
      topCategory: topEntry
        ? { category: topEntry[0], label: CATEGORY_CONFIG[topEntry[0]].label, amount: topEntry[1] }
        : null,
      pctChange: lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : null,
    }
  }, [expenses, currentYear, currentMonth])

  const thisMonthExpenses = useMemo(
    () => expenses.filter(e => {
      const [y, m] = e.date.split('-').map(Number)
      return y === currentYear && m === currentMonth
    }),
    [expenses, currentYear, currentMonth]
  )

  const recentExpenses = useMemo(
    () => [...expenses]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6),
    [expenses]
  )

  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">{monthLabel}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label="This Month"
          value={formatCurrency(stats.thisMonthTotal)}
          icon={<DollarSign size={18} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
          footer={
            stats.pctChange !== null ? (
              <div className={`flex items-center gap-1 text-xs font-medium ${stats.pctChange <= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {stats.pctChange <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {Math.abs(stats.pctChange).toFixed(1)}% vs last month
              </div>
            ) : (
              <span className="text-xs text-gray-400">No prior month data</span>
            )
          }
        />
        <SummaryCard
          label="Year to Date"
          value={formatCurrency(stats.ytdTotal)}
          icon={<Calendar size={18} className="text-blue-600" />}
          iconBg="bg-blue-50"
          footer={<span className="text-xs text-gray-400">{currentYear} total spending</span>}
        />
        <SummaryCard
          label="Top Category"
          value={stats.topCategory ? formatCurrency(stats.topCategory.amount) : '—'}
          icon={<BarChart2 size={18} className="text-violet-600" />}
          iconBg="bg-violet-50"
          footer={
            <span className="text-xs text-gray-400">
              {stats.topCategory ? stats.topCategory.label : 'No expenses this month'}
            </span>
          }
        />
        <SummaryCard
          label="Transactions"
          value={String(stats.thisMonthCount)}
          icon={<Hash size={18} className="text-amber-600" />}
          iconBg="bg-amber-50"
          footer={<span className="text-xs text-gray-400">This month</span>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">
            Spending by Category
            <span className="text-gray-400 font-normal ml-1.5">· This Month</span>
          </h2>
          <CategoryChart expenses={thisMonthExpenses} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Monthly Trend
            <span className="text-gray-400 font-normal ml-1.5">· Last 6 Months</span>
          </h2>
          <TrendChart expenses={expenses} />
        </div>
      </div>

      {/* Recent expenses */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Recent Expenses</h2>
          <Link href="/expenses" className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentExpenses.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No expenses yet.{' '}
              <Link href="/expenses" className="text-indigo-600 hover:underline">Add your first one.</Link>
            </div>
          ) : (
            recentExpenses.map(e => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_CONFIG[e.category].lightBg }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_CONFIG[e.category].color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{e.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(e.date)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="hidden sm:block">
                    <CategoryBadge category={e.category} />
                  </span>
                  <span className="text-sm font-semibold text-gray-900 min-w-[72px] text-right">
                    {formatCurrency(e.amount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label, value, icon, iconBg, footer,
}: {
  label: string
  value: string
  icon: React.ReactNode
  iconBg: string
  footer: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>{icon}</div>
      </div>
      {footer}
    </div>
  )
}
