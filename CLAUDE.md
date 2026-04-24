# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build + type check
npm run lint       # ESLint
npx tsc --noEmit   # Type-check without building
```

## Architecture

**Next.js 14 App Router** with TypeScript and Tailwind CSS. All pages are client components (`'use client'`) because they consume React context.

**State management** — `src/context/ExpenseContext.tsx` is a single React context that holds all expense data, persists to `localStorage`, and exposes `addExpense`, `updateExpense`, `deleteExpense`. It seeds sample data on first load. The `ExpenseProvider` wraps the entire app in `src/app/layout.tsx`; any component can call `useExpenses()` to access state.

**Routes**
- `/` — Dashboard: summary cards, category pie chart, monthly bar chart, recent expenses
- `/expenses` — Full expense list with search, category + date filters, add/edit modal, CSV export, delete confirmation

**Key directories**
- `src/types/` — `Expense` interface and `Category` union type
- `src/lib/` — `categories.ts` (color/label config per category), `utils.ts` (currency + date formatters), `export.ts` (CSV download)
- `src/components/charts/` — `CategoryChart.tsx` (recharts donut) and `TrendChart.tsx` (recharts bar) — must be `'use client'`
- `src/components/` — `Navigation.tsx` (sidebar desktop / hamburger mobile), `ExpenseModal.tsx` (add + edit), `CategoryBadge.tsx`

**Dependencies added beyond create-next-app defaults**
- `recharts` — charts (requires client components)
- `lucide-react` — icons

## Data model

```ts
interface Expense {
  id: string          // crypto.randomUUID()
  amount: number      // stored as float, displayed via Intl.NumberFormat
  category: Category  // 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other'
  description: string
  date: string        // YYYY-MM-DD
  createdAt: string   // ISO timestamp
}
```

## Styling conventions

- Background: `bg-slate-50`; cards: `bg-white` with `border border-gray-100 shadow-sm rounded-xl`
- Primary action: `bg-indigo-600 hover:bg-indigo-700`
- Category colors are defined once in `CATEGORY_CONFIG` (`src/lib/categories.ts`) and used everywhere (badges, chart cells, row icons)
- Modal animation uses `.modal-enter` CSS class defined in `src/app/globals.css`
