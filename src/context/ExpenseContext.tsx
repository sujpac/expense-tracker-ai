'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Expense } from '@/types/expense'

const STORAGE_KEY = 'expense-tracker-v1'

const SEED_EXPENSES: Expense[] = [
  // April 2026
  { id: 'seed-1', amount: 850.00, category: 'Bills', description: 'Monthly rent', date: '2026-04-01', createdAt: '2026-04-01T08:00:00Z' },
  { id: 'seed-2', amount: 45.00, category: 'Transportation', description: 'Monthly transit pass', date: '2026-04-01', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'seed-3', amount: 120.00, category: 'Bills', description: 'Electricity bill', date: '2026-04-05', createdAt: '2026-04-05T08:00:00Z' },
  { id: 'seed-4', amount: 92.40, category: 'Food', description: 'Weekly grocery run', date: '2026-04-07', createdAt: '2026-04-07T10:00:00Z' },
  { id: 'seed-5', amount: 38.75, category: 'Food', description: 'Restaurant with friends', date: '2026-04-10', createdAt: '2026-04-10T19:30:00Z' },
  { id: 'seed-6', amount: 67.50, category: 'Shopping', description: 'New sneakers', date: '2026-04-14', createdAt: '2026-04-14T14:00:00Z' },
  { id: 'seed-7', amount: 15.99, category: 'Entertainment', description: 'Netflix subscription', date: '2026-04-15', createdAt: '2026-04-15T10:00:00Z' },
  { id: 'seed-8', amount: 85.00, category: 'Food', description: 'Grocery shopping', date: '2026-04-18', createdAt: '2026-04-18T11:00:00Z' },
  { id: 'seed-9', amount: 22.50, category: 'Transportation', description: 'Uber rides', date: '2026-04-20', createdAt: '2026-04-20T18:00:00Z' },
  // March 2026
  { id: 'seed-10', amount: 850.00, category: 'Bills', description: 'Monthly rent', date: '2026-03-01', createdAt: '2026-03-01T08:00:00Z' },
  { id: 'seed-11', amount: 45.00, category: 'Transportation', description: 'Monthly transit pass', date: '2026-03-01', createdAt: '2026-03-01T09:00:00Z' },
  { id: 'seed-12', amount: 115.00, category: 'Bills', description: 'Internet + phone bundle', date: '2026-03-05', createdAt: '2026-03-05T08:00:00Z' },
  { id: 'seed-13', amount: 88.90, category: 'Food', description: 'Weekly groceries', date: '2026-03-10', createdAt: '2026-03-10T10:00:00Z' },
  { id: 'seed-14', amount: 156.30, category: 'Shopping', description: 'Spring clothing haul', date: '2026-03-15', createdAt: '2026-03-15T13:00:00Z' },
  { id: 'seed-15', amount: 24.99, category: 'Entertainment', description: 'Movie tickets', date: '2026-03-22', createdAt: '2026-03-22T18:00:00Z' },
  { id: 'seed-16', amount: 52.00, category: 'Food', description: 'Coffee shop & bakery', date: '2026-03-28', createdAt: '2026-03-28T09:00:00Z' },
  { id: 'seed-17', amount: 18.50, category: 'Other', description: 'Pharmacy items', date: '2026-03-30', createdAt: '2026-03-30T15:00:00Z' },
  // February 2026
  { id: 'seed-18', amount: 850.00, category: 'Bills', description: 'Monthly rent', date: '2026-02-01', createdAt: '2026-02-01T08:00:00Z' },
  { id: 'seed-19', amount: 45.00, category: 'Transportation', description: 'Monthly transit pass', date: '2026-02-01', createdAt: '2026-02-01T09:00:00Z' },
  { id: 'seed-20', amount: 95.50, category: 'Food', description: 'Grocery shopping', date: '2026-02-08', createdAt: '2026-02-08T11:00:00Z' },
  { id: 'seed-21', amount: 200.00, category: 'Shopping', description: "Valentine's gifts & dinner", date: '2026-02-13', createdAt: '2026-02-13T12:00:00Z' },
  { id: 'seed-22', amount: 89.99, category: 'Entertainment', description: 'Concert tickets', date: '2026-02-18', createdAt: '2026-02-18T20:00:00Z' },
  { id: 'seed-23', amount: 35.00, category: 'Other', description: 'Pharmacy & toiletries', date: '2026-02-20', createdAt: '2026-02-20T15:00:00Z' },
  { id: 'seed-24', amount: 112.00, category: 'Bills', description: 'Gas & electricity', date: '2026-02-05', createdAt: '2026-02-05T08:00:00Z' },
  // January 2026
  { id: 'seed-25', amount: 850.00, category: 'Bills', description: 'Monthly rent', date: '2026-01-01', createdAt: '2026-01-01T08:00:00Z' },
  { id: 'seed-26', amount: 45.00, category: 'Transportation', description: 'Monthly transit pass', date: '2026-01-01', createdAt: '2026-01-01T09:00:00Z' },
  { id: 'seed-27', amount: 340.00, category: 'Shopping', description: 'New year wardrobe refresh', date: '2026-01-10', createdAt: '2026-01-10T14:00:00Z' },
  { id: 'seed-28', amount: 78.40, category: 'Food', description: 'Weekly groceries', date: '2026-01-12', createdAt: '2026-01-12T11:00:00Z' },
  { id: 'seed-29', amount: 55.00, category: 'Entertainment', description: 'Streaming services', date: '2026-01-15', createdAt: '2026-01-15T10:00:00Z' },
]

interface ExpenseContextType {
  expenses: Expense[]
  isLoaded: boolean
  addExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => void
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void
  deleteExpense: (id: string) => void
}

const ExpenseContext = createContext<ExpenseContextType | null>(null)

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      setExpenses(stored ? JSON.parse(stored) : SEED_EXPENSES)
    } catch {
      setExpenses(SEED_EXPENSES)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    }
  }, [expenses, isLoaded])

  const addExpense = useCallback((data: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses(prev => [
      { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ...prev,
    ])
  }, [])

  const updateExpense = useCallback(
    (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
      setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)))
    },
    []
  )

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  return (
    <ExpenseContext.Provider value={{ expenses, isLoaded, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses(): ExpenseContextType {
  const ctx = useContext(ExpenseContext)
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider')
  return ctx
}
