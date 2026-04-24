import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ExpenseProvider } from '@/context/ExpenseContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ExpenseTrack',
  description: 'Personal expense tracking application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 antialiased`}>
        <ExpenseProvider>
          <Navigation />
          <div className="lg:pl-60 pt-14 lg:pt-0 min-h-screen">
            <main className="p-5 md:p-8 max-w-6xl mx-auto">
              {children}
            </main>
          </div>
        </ExpenseProvider>
      </body>
    </html>
  )
}
