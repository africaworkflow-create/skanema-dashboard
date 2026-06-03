'use client'
import { useState, useRef, useEffect } from 'react'
import { Menu, ExternalLink, Settings, LogOut } from 'lucide-react'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/hooks/useAuth'

export function DashboardLayout({ children, title, subtitle, actions }) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const { user, logout } = useAuth()
  const profileRef = useRef(null)

  // Ferme le dropdown en cliquant dehors
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const slug = user?.slug || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900 leading-tight">{title}</h1>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <NotificationBell />

              {/* Avatar + dropdown */}
              <div className="relative ml-1" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-medium hover:bg-gray-700 transition-colors"
                >
                  {user?.restaurantName?.[0]?.toUpperCase() || 'S'}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50"
                       style={{ animation: 'fadeDown 0.15s ease' }}>
                    <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

                    {/* Infos restaurant */}
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user?.restaurantName}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="py-1">
                      {slug && (
                        <a
                          href={`https://www.skanema.com/menu/${slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink size={13} className="text-gray-400" />
                          Voir mon menu
                        </a>
                      )}
                      <a
                        href="/dashboard/parametres"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={13} className="text-gray-400" />
                        Paramètres
                      </a>
                    </div>

                    <div className="border-t border-gray-50 py-1">
                      <button
                        onClick={() => { setProfileOpen(false); logout() }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={13} />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
