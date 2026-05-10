'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, ArrowLeft, Loader2, Eye, EyeOff, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react'
import Cookies from 'js-cookie'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

const PLANS = [
  {
    id      : 'basic',
    name    : 'Basic',
    price   : 15000,
    features: ['10 plats', 'Bot WhatsApp', 'Paiement Wave', '1 zone de livraison'],
  },
  {
    id      : 'pro',
    name    : 'Pro',
    price   : 35000,
    popular : true,
    features: ['25 plats', 'Bot WhatsApp', 'Stats avancées', '3 zones de livraison'],
  },
  {
    id      : 'premium',
    name    : 'Premium',
    price   : 75000,
    features: ['Plats illimités', 'Bot WhatsApp', 'Support prioritaire', 'Zones illimitées'],
  },
]

function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA' }

// Input sans zoom iOS — font-size 16px obligatoire
function Input({ type = 'text', value, onChange, onKeyDown, placeholder, className = '', children, ...rest }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{ fontSize: '16px' }}
        className={`w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none
                   focus:border-gray-400 transition-colors placeholder-gray-300 ${className}`}
        {...rest}
      />
      {children}
    </div>
  )
}

function OnboardingContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const initPlan     = searchParams.get('plan') || 'pro'

  const [step,         setStep]         = useState(1)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [showPass,     setShowPass]     = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(initPlan)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })

  const plan = PLANS.find(p => p.id === selectedPlan) || PLANS[1]

  // Force du mot de passe — 3 barres gauche → droite
  const passStrength = [
    form.password.length >= 8,
    /[A-Z]/.test(form.password) && /[a-z]/.test(form.password),
    /[0-9]/.test(form.password),
  ]

  const handleSubmit = async () => {
    if (!form.name.trim())  { setError('Le nom du restaurant est requis.');  return }
    if (!form.email.trim()) { setError('L\'email est requis.');              return }
    if (!form.phone.trim()) { setError('Le numéro de téléphone est requis.'); return }
    if (!passStrength.every(Boolean)) {
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
          phone   : form.phone.trim(),
          password: form.password,
          plan    : selectedPlan,
          whatsappPhoneNumberId: 'A_CONFIGURER',
          whatsappAccessToken  : 'A_CONFIGURER',
          whatsappVerifyToken  : 'skanema_' + Date.now(),
        }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Erreur. Veuillez réessayer.'); return }

      const isProd = window.location.hostname.includes('skanema.com')
      const domain = isProd ? '.skanema.com' : undefined
      const opts   = { expires: 7, secure: isProd, sameSite: isProd ? 'None' : 'Lax', domain }
      ;['.skanema.com', 'skanema.com', undefined].forEach(d => {
        Cookies.remove('skanema_token', { domain: d, path: '/' })
        Cookies.remove('skanema_user',  { domain: d, path: '/' })
      })
      Cookies.set('skanema_token', data.token,                opts)
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

      {/* ── Panneau gauche branding — desktop uniquement ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

        <div className="flex items-center gap-2.5 relative">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-gray-900" />
          </div>
          <span className="text-white text-lg font-semibold">Skanema</span>
        </div>

        <div className="relative">
          <div className="text-white/20 text-6xl font-serif leading-none mb-4">"</div>
          <p className="text-white text-lg font-medium leading-relaxed mb-6">
            Depuis Skanema, mes commandes WhatsApp ont augmenté de 40%.
            Le bot gère tout, je me concentre sur la cuisine.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 font-bold text-sm">FD</div>
            <div>
              <p className="text-white text-sm font-medium">Fatou Diallo</p>
              <p className="text-white/50 text-xs">Chez Fatou — Dakar</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative">
          {[
            { value: '50+',    label: 'Restaurants'  },
            { value: '2 400+', label: 'Commandes'    },
            { value: '99.9%',  label: 'Disponibilité'},
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit formulaire ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 lg:px-16">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-gray-900 text-base font-semibold">Skanema</span>
          </div>

          {/* Indicateur étapes */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { n: 1, label: 'Votre plan'  },
              { n: 2, label: 'Votre compte'},
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  s.n < step  ? 'bg-green-500 text-white' :
                  s.n === step ? 'bg-gray-900 text-white' :
                                 'bg-gray-100 text-gray-400'
                }`}>
                  {s.n < step ? <CheckCircle2 size={13} /> : s.n}
                </div>
                <span className={`text-xs ${s.n === step ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {i < 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          {/* ── ÉTAPE 1 — Plan ── */}
          {step === 1 && (
            <div style={{ animation: 'fadeUp 0.3s ease both' }}>
              <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">Choisissez votre plan</h1>
              <p className="text-sm text-gray-400 mb-6">
                Notre équipe vous contactera pour l'activation et le paiement Wave.
              </p>

              <div className="space-y-3 mb-6">
                {PLANS.map(p => {
                  const active = selectedPlan === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                        active && p.popular  ? 'border-gray-900 bg-gray-900' :
                        active               ? 'border-gray-900 bg-gray-50'  :
                                               'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold ${active && p.popular ? 'text-white' : 'text-gray-900'}`}>
                            {p.name}
                          </p>
                          {p.popular && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              active ? 'bg-white/20 text-white' : 'bg-gray-900 text-white'
                            }`}>
                              ⭐ Populaire
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className={`font-bold ${active && p.popular ? 'text-white' : 'text-gray-900'}`}>
                            {fmt(p.price)}
                            <span className={`text-xs font-normal ml-1 ${active && p.popular ? 'text-white/60' : 'text-gray-400'}`}>
                              /mois
                            </span>
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            active ? 'border-white bg-white' : 'border-gray-300'
                          }`}>
                            {active && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {p.features.map((f, i) => (
                          <span key={i} className={`text-xs flex items-center gap-1 ${
                            active && p.popular ? 'text-white/70' : 'text-gray-400'
                          }`}>
                            <CheckCircle2 size={10} /> {f}
                          </span>
                        ))}
                      </div>
                    </button>
                  )
                })}
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

          {/* ── ÉTAPE 2 — Compte ── */}
          {step === 2 && (
            <div style={{ animation: 'fadeUp 0.3s ease both' }}>
              <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">Créez votre compte</h1>
              <p className="text-sm text-gray-400 mb-6">
                Plan <span className="font-semibold text-gray-700">{plan.name}</span> · {fmt(plan.price)}/mois
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 underline ml-2 text-xs">
                  Changer
                </button>
              </p>

              <div className="space-y-4">

                {/* Nom */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom du restaurant *</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Ex: Chez Fatou, Le Pélican…"
                    autoFocus
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Numéro de téléphone *</label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="221 77 123 45 67"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Pour recevoir vos notifications de commandes sur WhatsApp.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="vous@email.com"
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Mot de passe *</label>
                  <Input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Min. 8 car. avec majuscule et chiffre"
                    className="pr-10"
                  >
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </Input>

                  {/* Indicateur force — gauche → droite */}
                  {form.password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1.5">
                        {passStrength.map((ok, i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: ok ? (i === 0 ? '#f59e0b' : i === 1 ? '#3b82f6' : '#10b981') : '#e5e7eb' }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        {passStrength.every(Boolean) ? '✅ Mot de passe fort' :
                         passStrength[0] ? '⚠️ Ajoutez une majuscule et un chiffre' :
                         '⚠️ Trop court'}
                      </p>
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

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setStep(1); setError('') }}
                  className="px-4 py-4 rounded-2xl border border-gray-200 text-gray-500
                             hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.name || !form.email || !form.phone || !form.password}
                  className="flex-1 bg-gray-900 text-white font-semibold py-4 rounded-2xl
                             flex items-center justify-center gap-2 hover:bg-gray-800
                             active:scale-[0.98] transition-all
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><Loader2 size={18} className="animate-spin" /> Création en cours…</>
                    : <><span>Accéder au dashboard</span><ArrowRight size={18} /></>
                  }
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                En créant un compte vous acceptez nos{' '}
                <a href="#" className="underline hover:text-gray-600">conditions d'utilisation</a>
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
