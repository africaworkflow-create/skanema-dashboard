'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import Cookies from 'js-cookie'
import { login as apiLogin } from '@/lib/api'

const AuthContext = createContext(null)

const isProd = typeof window !== 'undefined' && window.location.hostname.includes('skanema.com')

const COOKIE_OPTIONS = {
  expires  : 7,
  secure   : isProd,
  sameSite : isProd ? 'None' : 'Lax',
  domain   : isProd ? '.skanema.com' : undefined,
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  const token = Cookies.get('skanema_token')
  const data  = Cookies.get('skanema_user')
  if (token && data) {
    try { 
      setUser(JSON.parse(data)) 
    } catch (_) {
      // Cookie corrompu → on nettoie
      Cookies.remove('skanema_token')
      Cookies.remove('skanema_user')
    }
  }
  setLoading(false)
}, [])

  

  const login = async (email, password) => {
  const res = await apiLogin(email, password)
  const { token, data } = res.data
  Cookies.set('skanema_token', token, COOKIE_OPTIONS)
  Cookies.set('skanema_user', JSON.stringify(data), COOKIE_OPTIONS)
  setUser(data)
  
  // Redirige vers dashboard.skanema.com en production
  const isProd = window.location.hostname.includes('skanema.com')
  if (isProd) {
    window.location.href = 'https://dashboard.skanema.com'
  } else {
    window.location.href = '/dashboard'
  }
  
  return data
}

  const logout = () => {
    Cookies.remove('skanema_token', { domain: isProd ? '.skanema.com' : undefined })
    Cookies.remove('skanema_user',  { domain: isProd ? '.skanema.com' : undefined })
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