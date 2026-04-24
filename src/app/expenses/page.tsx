'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Download, Pencil, Trash2, X } from 'lucide-react'
import { useExpenses } from '@/context/ExpenseContext'
import { formatCurrency, formatDate, todayString } from '@/lib/utils'
import { CATEGORIES, CATEGORY_CONFIG } from '@/lib/categories'
import { exportToCSV } from '@/lib/export'
import ExpenseModal from '@/components/ExpenseModal'
import CategoryBadge from '@/components/CategoryBadge'
import type { Expense, Category } from '@/types/expense'

export default function ExpensesPage() {
  const { expenses, isLoaded, deleteExpense } = useExpenses()

  const [modalOpen, setModalOpen] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<Category | ''>('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  const filtered = useMemo(() => {
    let list = [...expenses]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(e => e.description.toLowerCase().includes(q))
    }
    if (filterCategory) list = list.filter(e => e.category === filterCategory)
    if (filterFrom) list = list.filter(e => e.date >= filterFrom)
    if (filterTo) list = list.filter(e => e.date <= filterTo)
    return list.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  }, [expenses, search, filterCategory, filterFrom, filterTo])

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0)
  const hasFilters = !!(search || filterCategory || filterFrom || filterTo)

  function openAdd() { setEditExpense(undefined); setModalOpen(true) }
  function openEdit(expense: Expense) { setEditExpense(expense); setModalOpen(true) }
  function closeModal() { setModalOpen(false); setEditExpense(undefined) }

  function clearFilters() {
    setSearch('')
    setFilterCategory('')
    setFilterFrom('')
    setFilterTo('')
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{expenses.length} total transactions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={15} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search expenses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as Category | '')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterFrom}
            max={filterTo || todayString()}
            onChange={e => setFilterFrom(e.target.value)}
            placeholder="From"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
          />
          <input
            type="date"
            value={filterTo}
            min={filterFrom}
            max={todayString()}
            onChange={e => setFilterTo(e.target.value)}
            placeholder="To"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
          />
        </div>

        {hasFilters && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <span className="text-xs text-gray-500">
              {filtered.length} of {expenses.length} shown · Total: {formatCurrency(filteredTotal)}
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <X size={12} /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Search size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">No expenses found</p>
            <p className="text-xs text-gray-400 mt-1">
              {hasFilters ? 'Try adjusting your filters' : 'Add your first expense to get started'}
            </p>
            {!hasFilters && (
              <button
                onClick={openAdd}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={15} /> Add Expense
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden sm:grid grid-cols-12 px-5 py-3 bg-gray-50/80 border-b border-gray-100">
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</div>
              <div className="col-span-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</div>
              <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Amount</div>
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map(expense => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onEdit={() => openEdit(expense)}
                  onDelete={() => setDeleteTarget(expense.id)}
                />
              ))}
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50/40 border-t border-gray-100">
              <span className="text-xs text-gray-500">{filtered.length} transactions</span>
              <span className="text-sm font-semibold text-gray-900">
                Total: {formatCurrency(filteredTotal)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && <ExpenseModal expense={editExpense} onClose={closeModal} />}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 modal-enter">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 text-center mb-2">Delete this expense?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteExpense(deleteTarget); setDeleteTarget(null) }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExpenseRow({
  expense,
  onEdit,
  onDelete,
}: {
  expense: Expense
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="group px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
      {/* Mobile layout */}
      <div className="flex sm:hidden items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
            <CategoryBadge category={expense.category} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-12 items-center gap-2">
        <div className="col-span-2 text-sm text-gray-500">{formatDate(expense.date)}</div>
        <div className="col-span-5 text-sm font-medium text-gray-900 truncate">{expense.description}</div>
        <div className="col-span-3">
          <CategoryBadge category={expense.category} />
        </div>
        <div className="col-span-2 flex items-center justify-end gap-1">
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
          <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
            <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
              <Pencil size={13} />
            </button>
            <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
