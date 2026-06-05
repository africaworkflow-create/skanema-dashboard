'use client'
import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ChevronRight, X, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api, { getMenu, getZones } from '@/lib/api'

const STEPS = [
  {
    id  : 'account',
    label: 'Compte créé',
    desc : 'Votre restaurant est enregistré sur Skanema.',
    done : true,
    link : null,
    cta  : null,
  },
  {
    id  : 'menu',
    label: 'Ajoutez votre premier plat',
    desc : 'Commencez par ajouter vos plats avec photos et prix.',
    done : false,
    link : '/dashboard/menu',
    cta  : 'Ajouter un plat →',
  },
  {
    id  : 'zones',
    label: 'Configurez vos zones de livraison',
    desc : 'Définissez vos zones et tarifs de livraison.',
    done : false,
    link : '/dashboard/zones',
    cta  : 'Configurer les zones →',
  },
  {
    id      : 'whatsapp',
    label   : 'Connectez votre WhatsApp Business',
    desc    : 'Connectez votre numéro WhatsApp Business pour activer votre bot de commande.',
    done    : false,
    link    : '/dashboard/whatsapp',
    cta     : 'Connecter WhatsApp →',
  },
]

export function SetupChecklist() {
  const { user }            = useAuth()
  const [steps,    setSteps]    = useState(STEPS)
  const [expanded, setExpanded] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!user?.restaurantId) return

    // Vérifie si dismissed en DB
    if (user?.uiPreferences?.checklistDismissed) {
      setDismissed(true)
      setLoading(false)
      return
    }

    const check = async () => {
      try {
        const [menuRes, zonesRes, meRes] = await Promise.allSettled([
          getMenu(),
          getZones(),
          api.get('/api/auth/me'),
        ])

        const hasMenu = menuRes.status === 'fulfilled' && menuRes.value.data.count > 0

        const pid   = meRes.status === 'fulfilled' ? meRes.value.data.data?.whatsappPhoneNumberId : null
        const hasWA = pid && !pid.startsWith('PENDING_') && pid !== 'A_CONFIGURER'

        const zones    = zonesRes.status === 'fulfilled' ? zonesRes.value.data.zones || [] : []
        const location = zonesRes.status === 'fulfilled' ? zonesRes.value.data.location : null
        const hasCustomPos = location &&
          !(Math.abs(location.latitude - 14.6937) < 0.001 && Math.abs(location.longitude - (-17.4441)) < 0.001)
        const hasZones = hasCustomPos && zones.some(z => z.active)

        setSteps(prev => prev.map(s => ({
          ...s,
          done: s.id === 'account'  ? true    :
                s.id === 'menu'     ? hasMenu :
                s.id === 'zones'    ? hasZones :
                s.id === 'whatsapp' ? hasWA   : false,
        })))
      } catch (_) {}
      finally { setLoading(false) }
    }
    check()
  }, [user])

  const doneCount = steps.filter(s => s.done).length
  const allDone   = doneCount === steps.length
  const progress  = Math.round((doneCount / steps.length) * 100)

  const handleDismiss = async () => {
    setDismissed(true)
    try { await api.patch('/api/auth/ui-preferences', { checklistDismissed: true }) } catch (_) {}
  }

  if (dismissed || loading) return null

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6 shadow-sm">

      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {allDone ? '🎉 Tout est prêt !' : 'Démarrer avec Skanema'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{doneCount}/{steps.length} étapes complétées</p>
            </div>
          </div>
          <button onClick={handleDismiss}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        </div>
        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 rounded-full transition-all duration-700" style={{ width: progress + '%' }} />
        </div>
      </div>

      {/* Étapes */}
      <div className="border-t border-gray-50">
        {steps.map((step, i) => {
          const isExp = expanded === step.id
          return (
            <div key={step.id} className={`border-b border-gray-50 last:border-0 ${step.done ? 'opacity-60' : ''}`}>
              <button onClick={() => setExpanded(isExp ? null : step.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-shrink-0">
                  {step.done
                    ? <CheckCircle2 size={20} className="text-green-500" />
                    : <Circle size={20} className="text-gray-200" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {step.label}
                  </p>
                </div>
                {!step.done && <span className="text-xs text-gray-300 flex-shrink-0">{i + 1}</span>}
                <ChevronRight size={14} className={`text-gray-300 flex-shrink-0 transition-transform duration-200 ${isExp ? 'rotate-90' : ''}`} />
              </button>

              {isExp && (
                <div className="px-5 pb-4 pt-1 ml-8">
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{step.desc}</p>
                  {!step.done && step.cta && (
                    <a href={step.link}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      {step.cta}
                    </a>
                  )}
                  {step.done && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} /> Complété
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allDone && (
        <div className="px-5 py-4 bg-green-50 border-t border-green-100 flex items-center justify-between">
          <p className="text-xs text-green-700 font-medium">🚀 Votre restaurant est prêt à recevoir des commandes !</p>
          <button onClick={handleDismiss} className="text-xs text-green-600 underline">Fermer</button>
        </div>
      )}
    </div>
  )
}
