'use client'
import { useState, useEffect, createContext, useContext, useRef } from 'react'
import Cookies from 'js-cookie'
import { login as apiLogin } from '@/lib/api'
import api from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    const token = Cookies.get('skanema_token')
    const data  = Cookies.get('skanema_user')
    if (token && data) {
      try { setUser(JSON.parse(data)) } catch (_) {}
    }

    // Enrichit les données user avec /api/auth/me une seule fois
    if (token && !fetchedRef.current) {
      fetchedRef.current = true
      api.get('/api/auth/me').then(res => {
        const d = res.data.data
        setUser(prev => prev ? { ...prev, ...d } : d)
      }).catch(() => {})
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin(email, password)
    const { token, data } = res.data
    Cookies.set('skanema_token', token, { expires: 7, secure: true, sameSite: 'strict' })
    Cookies.set('skanema_user',  JSON.stringify(data), { expires: 7 })
    setUser(data)
    return data
  }

  const logout = () => {
    const domains = ['.skanema.com', 'skanema.com', 'dashboard.skanema.com', undefined]
    domains.forEach(domain => {
      Cookies.remove('skanema_token', { domain, path: '/' })
      Cookies.remove('skanema_user',  { domain, path: '/' })
    })
    document.cookie = 'skanema_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.skanema.com;path=/'
    document.cookie = 'skanema_user=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.skanema.com;path=/'
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
