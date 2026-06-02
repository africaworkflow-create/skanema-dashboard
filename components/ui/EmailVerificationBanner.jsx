'use client'
import { useState } from 'react'
import { Mail, X, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

export function EmailVerificationBanner() {
  const { user }              = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)

  // N'affiche pas si email déjà vérifié ou bannière ignorée
  if (user?.emailVerified || dismissed) return null

  const handleResend = async () => {
    setSending(true)
    try {
      const token = Cookies.get('skanema_token')
      await fetch(`${API_URL}/api/auth/resend-verification`, {
        method : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      setSent(true)
    } catch (_) {}
    finally { setSending(false) }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <Mail size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-800">Vérifiez votre adresse email</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Votre bot WhatsApp est désactivé jusqu'à vérification.{' '}
            {sent ? (
              <span className="text-green-700 font-medium flex items-center gap-1 inline-flex">
                <CheckCircle2 size={11} /> Email renvoyé !
              </span>
            ) : (
              <button onClick={handleResend} disabled={sending}
                className="underline font-medium hover:text-amber-900 transition-colors">
                {sending ? <Loader2 size={11} className="animate-spin inline" /> : 'Renvoyer l\'email'}
              </button>
            )}
          </p>
        </div>
      </div>
      <button onClick={() => setDismissed(true)}
        className="text-amber-500 hover:text-amber-700 flex-shrink-0 transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}
