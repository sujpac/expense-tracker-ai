'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, Menu, X, Wallet } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 fixed left-0 top-0 bottom-0 z-40">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wallet size={18} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base tracking-tight">ExpenseTrack</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">Data stored locally</p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Wallet size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold">ExpenseTrack</span>
          </div>
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-slate-700/50 px-3 py-2 space-y-0.5 bg-slate-900">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
