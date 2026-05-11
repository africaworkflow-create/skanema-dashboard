'use client'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/hooks/useAuth'

export function DashboardLayout({ children, title, subtitle, actions }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Burger mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900 leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <NotificationBell />
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center
                              text-white text-xs font-medium ml-1">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
