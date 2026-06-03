'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/login'); return }

    // Vérifie si trial expiré ou suspendu
    const sub = user?.subscription
    if (!sub) return
    const isTrialExpired = sub.status === 'trial' && new Date() > new Date(sub.trialEnds)
    const isSuspended    = sub.status === 'suspended' || sub.status === 'cancelled'

    if (isTrialExpired || isSuspended) {
      router.replace('/abonnement-expire')
    }
  }, [user, loading, router])

  if (loading || !user) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return <>{children}</>
}
