export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other'

export interface Expense {
  id: string
  amount: number
  category: Category
  description: string
  date: string
  createdAt: string
}
