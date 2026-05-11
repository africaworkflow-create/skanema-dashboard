'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toggle } from '@/components/ui/Toggle'
import { Loader2, CheckCircle2, Eye, EyeOff, AlertTriangle, Info } from 'lucide-react'
import api from '@/lib/api'

const PAYMENT_METHODS = [
  {
    id     : 'wave',
    name   : 'Wave',
    logo   : '🌊',
    desc   : 'Paiement mobile Wave — le plus utilisé au Sénégal',
    active : true,
    soon   : false,
  },
  {
    id     : 'cash',
    name   : 'Cash à la livraison',
    logo   : '💵',
    desc   : 'Le client paie en espèces à la réception de sa commande',
    active : false,
    soon   : false,
  },
  {
    id     : 'orange',
    name   : 'Orange Money',
    logo   : '🟠',
    desc   : 'Paiement mobile Orange Money',
    active : false,
    soon   : true,
  },
  {
    id     : 'free',
    name   : 'Free Money',
    logo   : '🔵',
    desc   : 'Paiement mobile Free Money',
    active : false,
    soon   : true,
  },
]

export default function PaiementsPage() {
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [showSecret,  setShowSecret]  = useState(false)
  const [showApiKey,  setShowApiKey]  = useState(false)
  const [cashEnabled, setCashEnabled] = useState(false)
  const [wave, setWave] = useState({ apiKey: '', webhookSecret: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/auth/me')
        const d   = res.data.data
        setWave({
          apiKey       : d.waveApiKey        || '',
          webhookSecret: d.waveWebhookSecret || '',
        })
        setCashEnabled(d.cashEnabled || false)
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSaveWave = async () => {
    if (!wave.apiKey || !wave.webhookSecret) {
      setError('Les deux champs sont requis.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.patch('/api/auth/payment', {
        waveApiKey       : wave.apiKey,
        waveWebhookSecret: wave.webhookSecret,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (_) {
      setError('Erreur lors de la sauvegarde.')
    }
    finally { setSaving(false) }
  }

  const handleToggleCash = async (val) => {
    setCashEnabled(val)
    try {
      await api.patch('/api/auth/payment', { cashEnabled: val })
    } catch (_) {}
  }

  const waveConfigured = wave.apiKey && wave.apiKey !== '' && wave.apiKey !== 'A_CONFIGURER'

  if (loading) return (
    <DashboardLayout title="Paiements" subtitle="Configurez vos moyens de paiement">
      <div className="flex justify-center py-20">
        <Loader2 size={22} className="animate-spin text-gray-300" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Paiements" subtitle="Configurez vos moyens de paiement">
      <div className="max-w-2xl space-y-5">

        {/* Info */}
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Configurez vos moyens de paiement pour que vos clients puissent régler leurs commandes.
            Les paiements arrivent directement sur votre compte.
          </p>
        </div>

        {/* Wave */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌊</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Wave</p>
                <p className="text-xs text-gray-400">Paiement mobile Wave</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              waveConfigured
                ? 'bg-green-50 text-green-700'
                : 'bg-amber-50 text-amber-600'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${waveConfigured ? 'bg-green-500' : 'bg-amber-400'}`} />
              {waveConfigured ? 'Configuré' : 'Non configuré'}
            </div>
          </div>

          {/* Formulaire */}
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
              <Info size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Récupérez votre clé API et webhook secret dans votre{' '}
                <a href="https://business.wave.com" target="_blank" rel="noopener noreferrer"
                   className="underline hover:text-gray-700">
                  dashboard Wave Business
                </a>
                {' '}→ Développeurs → API.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Clé API Wave
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={wave.apiKey}
                  onChange={e => setWave(w => ({ ...w, apiKey: e.target.value }))}
                  placeholder="wave_sn_prod_xxxxxxxx"
                  className="input pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Webhook Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={wave.webhookSecret}
                  onChange={e => setWave(w => ({ ...w, webhookSecret: e.target.value }))}
                  placeholder="whsec_xxxxxxxx"
                  className="input pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                URL Webhook à configurer dans Wave :{' '}
                <span className="font-mono bg-gray-50 px-1 py-0.5 rounded text-gray-600">
                  https://api.skanema.com/api/payment/wave/webhook
                </span>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSaveWave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : null}
              {saved  ? <><CheckCircle2 size={13} /> Enregistré !</> : 'Enregistrer'}
            </button>
          </div>
        </div>

        {/* Cash à la livraison */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Cash à la livraison</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Le client paie en espèces à la réception
                </p>
              </div>
            </div>
            <Toggle checked={cashEnabled} onChange={handleToggleCash} />
          </div>
        </div>

        {/* Bientôt disponible */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-1">
            Bientôt disponible
          </p>
          {PAYMENT_METHODS.filter(m => m.soon).map(m => (
            <div key={m.id} className="bg-white border border-gray-100 rounded-xl p-5
                                        opacity-50 pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.logo}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  Bientôt
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
