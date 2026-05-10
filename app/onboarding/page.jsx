'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2, Eye, EyeOff, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react'
import Cookies from 'js-cookie'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

const PLANS = [
  {
    id      : 'basic',
    name    : 'Basic',
    price   : 15000,
    desc    : 'Pour démarrer',
    color   : '#f9fafb',
    features: ['10 plats', 'Bot WhatsApp', 'Paiement Wave', '1 zone de livraison'],
  },
  {
    id      : 'pro',
    name    : 'Pro',
    price   : 35000,
    desc    : 'Le plus populaire',
    color   : '#111827',
    popular : true,
    features: ['25 plats', 'Bot WhatsApp', 'Stats avancées', '3 zones de livraison'],
  },
  {
    id      : 'premium',
    name    : 'Premium',
    price   : 75000,
    desc    : 'Sans limites',
    color   : '#f9fafb',
    features: ['Plats illimités', 'Bot WhatsApp', 'Support prioritaire', 'Zones illimitées'],
  },
]

function formatFCFA(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

function OnboardingContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const initPlan     = searchParams.get('plan') || 'pro'

  const [step,        setStep]        = useState(1)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(initPlan)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const plan = PLANS.find(p => p.id === selectedPlan) || PLANS[1]

  const handleSubmit = async () => {
    if (!form.name.trim())  { setError('Le nom du restaurant est requis.'); return }
    if (!form.email.trim()) { setError('L\'email est requis.'); return }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passRegex.test(form.password)) {
      setError('Mot de passe : 8 caractères minimum, une majuscule, une minuscule et un chiffre.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res  = await fetch(`${API_URL}/api/auth/register`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          name    : form.name.trim(),
          email   : form.email.trim(),
          password: form.password,
          plan    : selectedPlan,
          whatsappPhoneNumberId: 'A_CONFIGURER',
          whatsappAccessToken  : 'A_CONFIGURER',
          whatsappVerifyToken  : 'skanema_' + Date.now(),
        }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Erreur. Veuillez réessayer.'); return }

      // Efface les anciens cookies et stocke le nouveau token
      const isProd = window.location.hostname.includes('skanema.com')
      const domain = isProd ? '.skanema.com' : undefined
      const opts   = { expires: 7, secure: isProd, sameSite: isProd ? 'None' : 'Lax', domain }
      ;['.skanema.com', 'skanema.com', undefined].forEach(d => {
        Cookies.remove('skanema_token', { domain: d, path: '/' })
        Cookies.remove('skanema_user',  { domain: d, path: '/' })
      })
      Cookies.set('skanema_token', data.token,               opts)
      Cookies.set('skanema_user',  JSON.stringify(data.data), opts)

      router.push('/dashboard')
    } catch (_) {
      setError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* ── Panneau gauche — branding ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Décoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-gray-900" />
          </div>
          <span className="text-white text-lg font-semibold">Skanema</span>
        </div>

        {/* Témoignage */}
        <div className="relative">
          <div className="text-white/20 text-6xl font-serif leading-none mb-4">"</div>
          <p className="text-white text-lg font-medium leading-relaxed mb-6">
            Depuis Skanema, mes commandes WhatsApp ont augmenté de 40%. 
            Le bot gère tout, je me concentre sur la cuisine.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 font-bold">F</div>
            <div>
              <p className="text-white text-sm font-medium">Fatou Diallo</p>
              <p className="text-white/50 text-xs">Chez Fatou — Dakar</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 relative">
          {[
            { value: '50+',    label: 'Restaurants' },
            { value: '2 400+', label: 'Commandes'   },
            { value: '99.9%',  label: 'Disponibilité' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-gray-900 text-base font-semibold">Skanema</span>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s < step  ? 'bg-green-500 text-white' :
                  s === step ? 'bg-gray-900 text-white' :
                               'bg-gray-100 text-gray-400'
                }`}>
                  {s < step ? <CheckCircle2 size={14} /> : s}
                </div>
                <span className={`text-xs ${s === step ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {s === 1 ? 'Votre plan' : 'Votre compte'}
                </span>
                {s < 2 && <div className="w-8 h-px bg-gray-200 ml-1" />}
              </div>
            ))}
          </div>

          {/* ── ÉTAPE 1 — Choix du plan ── */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Choisissez votre plan</h1>
              <p className="text-sm text-gray-400 mb-6">Notre équipe vous contactera pour l'activation et le paiement.</p>

              <div className="space-y-3 mb-6">
                {PLANS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                      selectedPlan === p.id
                        ? p.popular
                          ? 'border-gray-900 bg-gray-900'
                          : 'border-gray-900 bg-gray-50'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${selectedPlan === p.id && p.popular ? 'text-white' : 'text-gray-900'}`}>
                          {p.name}
                        </p>
                        {p.popular && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            selectedPlan === p.id ? 'bg-white/20 text-white' : 'bg-gray-900 text-white'
                          }`}>
                            Populaire ⭐
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <span className={`text-base font-bold ${selectedPlan === p.id && p.popular ? 'text-white' : 'text-gray-900'}`}>
                            {formatFCFA(p.price)}
                          </span>
                          <span className={`text-xs ml-1 ${selectedPlan === p.id && p.popular ? 'text-white/60' : 'text-gray-400'}`}>
                            /mois
                          </span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === p.id
                            ? 'border-white bg-white'
                            : 'border-gray-300'
                        }`}>
                          {selectedPlan === p.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {p.features.map((f, i) => (
                        <span key={i} className={`text-xs flex items-center gap-1 ${
                          selectedPlan === p.id && p.popular ? 'text-white/70' : 'text-gray-400'
                        }`}>
                          <CheckCircle2 size={10} /> {f}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl
                           flex items-center justify-center gap-2 hover:bg-gray-800
                           active:scale-[0.98] transition-all"
              >
                Continuer <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* ── ÉTAPE 2 — Création compte ── */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">Créez votre compte</h1>
              <p className="text-sm text-gray-400 mb-6">
                Plan <span className="font-semibold text-gray-700">{plan.name}</span> · {formatFCFA(plan.price)}/mois
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 underline ml-2 text-xs">
                  Changer
                </button>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Nom du restaurant *
                  </label>
                  <input
                    autoFocus
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Ex: Chez Fatou, Le Pélican…"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                               outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="vous@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                               outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      placeholder="Min. 8 car. avec majuscule et chiffre"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                                 outline-none focus:border-gray-400 transition-colors pr-10 placeholder-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Indicateur force mot de passe */}
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[
                        form.password.length >= 8,
                        /[A-Z]/.test(form.password),
                        /[0-9]/.test(form.password),
                      ].map((ok, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${ok ? 'bg-green-500' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.email || !form.password}
                className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl mt-6
                           flex items-center justify-center gap-2 hover:bg-gray-800
                           active:scale-[0.98] transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> Création en cours…</>
                  : <><span>Accéder au dashboard</span><ArrowRight size={18} /></>
                }
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                En créant un compte vous acceptez nos{' '}
                <a href="/terms" className="underline hover:text-gray-600">conditions d'utilisation</a>
              </p>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
