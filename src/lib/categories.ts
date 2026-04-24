import type { Category } from '@/types/expense'

export interface CategoryConfig {
  label: string
  color: string
  bgClass: string
  textClass: string
  lightBg: string
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  Food: {
    label: 'Food & Dining',
    color: '#10B981',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-700',
    lightBg: '#D1FAE5',
  },
  Transportation: {
    label: 'Transportation',
    color: '#3B82F6',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    lightBg: '#DBEAFE',
  },
  Entertainment: {
    label: 'Entertainment',
    color: '#8B5CF6',
    bgClass: 'bg-violet-100',
    textClass: 'text-violet-700',
    lightBg: '#EDE9FE',
  },
  Shopping: {
    label: 'Shopping',
    color: '#EC4899',
    bgClass: 'bg-pink-100',
    textClass: 'text-pink-700',
    lightBg: '#FCE7F3',
  },
  Bills: {
    label: 'Bills & Utilities',
    color: '#F59E0B',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-700',
    lightBg: '#FEF3C7',
  },
  Other: {
    label: 'Other',
    color: '#6B7280',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-600',
    lightBg: '#F3F4F6',
  },
}

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
]
