'use client'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, MessageCircle, CheckCircle2 } from 'lucide-react'

const PLANS = [
  {
    id   : 'basic',
    name : 'Basic',
    price: '15 000',
    features: ['10 plats au menu', 'Bot WhatsApp', 'Paiement Wave', '1 zone de livraison'],
  },
  {
    id   : 'pro',
    name : 'Pro',
    price: '35 000',
    popular: true,
    features: ['25 plats au menu', 'Bot WhatsApp', 'Paiement Wave', '3 zones de livraison', 'Statistiques avancées'],
  },
  {
    id   : 'premium',
    name : 'Premium',
    price: '75 000',
    features: ['Plats illimités', 'Bot WhatsApp', 'Paiement Wave', 'Zones illimitées', 'Support prioritaire'],
  },
]

const WA_NUMBER = '221778075388'

function buildWAMessage(plan, restaurantName) {
  return encodeURIComponent(
    `Bonjour Skanema, je souhaite activer mon abonnement ${plan.name} (${plan.price} FCFA/mois) pour mon restaurant "${restaurantName}". Merci de me communiquer les instructions de paiement Wave.`
  )
}

export default function AbonnementExpirePage() {
  const { user, logout } = useAuth()
  const sub              = user?.subscription
  const isExpired        = sub?.status === 'trial'
  const isSuspended      = sub?.status === 'suspended' || sub?.status === 'cancelled'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="text-base font-semibold tracking-tight text-gray-900">Skanema</div>
        <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Se déconnecter
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* Alerte */}
        <div className="w-full max-w-md mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {isExpired ? 'Votre essai gratuit est terminé' : 'Votre abonnement est suspendu'}
              </p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                {isExpired
                  ? 'Vos 14 jours d\'essai sont écoulés. Choisissez un plan pour continuer à recevoir des commandes via WhatsApp.'
                  : 'Votre accès a été suspendu. Régularisez votre situation pour réactiver votre bot WhatsApp.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Choisissez votre plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.id}
                className={`bg-white rounded-2xl p-5 flex flex-col ${
                  plan.popular
                    ? 'border-2 border-gray-900 shadow-lg relative'
                    : 'border border-gray-100'
                }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white
                                  text-2xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    Recommandé
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xs text-gray-400">FCFA/mois</span>
                  </div>
                </div>

                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${buildWAMessage(plan, user?.restaurantName || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MessageCircle size={15} />
                  Payer via WhatsApp
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Paiement via Wave · Activation immédiate après confirmation · Sans engagement
          </p>
        </div>
      </div>
    </div>
  )
}
