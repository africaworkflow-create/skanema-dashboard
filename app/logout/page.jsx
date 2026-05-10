'use client'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

export default function LogoutPage() {
  useEffect(() => {
    // Efface tous les cookies sur tous les domaines possibles
    const domains = ['.skanema.com', 'skanema.com', 'dashboard.skanema.com', undefined]
    domains.forEach(domain => {
      Cookies.remove('skanema_token', { domain, path: '/' })
      Cookies.remove('skanema_user',  { domain, path: '/' })
    })
    // Efface aussi via document.cookie brut
    document.cookie = 'skanema_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.skanema.com;path=/'
    document.cookie = 'skanema_user=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.skanema.com;path=/'
    document.cookie = 'skanema_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    document.cookie = 'skanema_user=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'

    setTimeout(() => { window.location.href = '/login' }, 500)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-400">Déconnexion en cours…</p>
    </div>
  )
}