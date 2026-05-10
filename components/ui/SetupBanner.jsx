'use client'
import { useState } from 'react'
import { X, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function SetupBanner() {
  const { user }       = useAuth()
  const [dismissed, setDismissed] = useState(false)

  // N'affiche que si WhatsApp pas encore configuré
  const waConfigured = user?.whatsappConfigured
  if (waConfigured || dismissed) return null

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 mb-6 relative overflow-hidden">
      {/* Décoration */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute right-8 bottom-0 w-20 h-20 bg-white/5 rounded-full translate-y-6" />

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3 relative">
        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <MessageCircle size={20} className="text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-0.5">
            Activez votre bot WhatsApp 🚀
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Votre compte est prêt. Notre équipe va configurer votre bot WhatsApp sous 24h.
            En attendant, ajoutez vos plats et configurez vos zones de livraison.
          </p>

          {/* Étapes */}
          <div className="space-y-2 mb-4">
            {[
              { label: 'Compte créé',                done: true  },
              { label: 'Ajoutez vos plats au menu',  done: false, link: '/dashboard/menu'  },
              { label: 'Configurez vos zones',        done: false, link: '/dashboard/zones' },
              { label: 'Activation WhatsApp par Skanema', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.done ? 'bg-green-500' : 'bg-white/10'
                }`}>
                  {step.done
                    ? <CheckCircle2 size={12} className="text-white" />
                    : <span className="text-2xs text-white/50 font-bold">{i + 1}</span>
                  }
                </div>
                {step.link ? (
                  <a href={step.link} className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1">
                    {step.label} <ChevronRight size={10} />
                  </a>
                ) : (
                  <span className={`text-xs ${step.done ? 'text-green-400' : 'text-white/50'}`}>
                    {step.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/221784632103?text=Bonjour%20Skanema%2C%20je%20viens%20de%20créer%20mon%20compte%20et%20je%20souhaite%20activer%20mon%20bot%20WhatsApp."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white
                       text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <MessageCircle size={13} />
            Contacter Skanema pour l'activation
          </a>
        </div>
      </div>
    </div>
  )
}
