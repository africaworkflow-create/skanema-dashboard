'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import Cookies from 'js-cookie'
import { login as apiLogin } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('skanema_token')
    const data  = Cookies.get('skanema_user')
    if (token && data) {
      try { setUser(JSON.parse(data)) } catch (_) {}
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
    Cookies.remove('skanema_token')
    Cookies.remove('skanema_user')
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
