import type { Expense } from '@/types/expense'

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Description', 'Category', 'Amount']
  const rows = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => [
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      e.category,
      e.amount.toFixed(2),
    ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
