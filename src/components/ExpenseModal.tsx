'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Expense, Category } from '@/types/expense'
import { CATEGORIES, CATEGORY_CONFIG } from '@/lib/categories'
import { useExpenses } from '@/context/ExpenseContext'
import { todayString } from '@/lib/utils'

interface Props {
  expense?: Expense
  onClose: () => void
}

interface FormErrors {
  amount?: string
  date?: string
  description?: string
}

export default function ExpenseModal({ expense, onClose }: Props) {
  const { addExpense, updateExpense } = useExpenses()
  const isEdit = !!expense

  const [amount, setAmount] = useState(expense ? expense.amount.toString() : '')
  const [date, setDate] = useState(expense ? expense.date : todayString())
  const [category, setCategory] = useState<Category>(expense ? expense.category : 'Food')
  const [description, setDescription] = useState(expense ? expense.description : '')
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function validate(): boolean {
    const errs: FormErrors = {}
    const parsed = parseFloat(amount)
    if (!amount || isNaN(parsed) || parsed <= 0) errs.amount = 'Enter a valid amount greater than $0'
    else if (parsed > 1_000_000) errs.amount = 'Amount cannot exceed $1,000,000'
    if (!date) errs.date = 'Please select a date'
    if (!description.trim() || description.trim().length < 2) errs.description = 'Description must be at least 2 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const data = {
      amount: Math.round(parseFloat(amount) * 100) / 100,
      date,
      category,
      description: description.trim(),
    }
    if (isEdit) updateExpense(expense.id, data)
    else addExpense(data)
    setTimeout(() => { setSaving(false); onClose() }, 150)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: undefined })) }}
                className={`w-full pl-7 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>
            {errors.amount && <p className="mt-1.5 text-xs text-red-600">{errors.amount}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              max={todayString()}
              onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date: undefined })) }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            />
            {errors.date && <p className="mt-1.5 text-xs text-red-600">{errors.date}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:border-gray-300 transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <input
              type="text"
              placeholder="What was this expense for?"
              value={description}
              maxLength={100}
              onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: undefined })) }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
