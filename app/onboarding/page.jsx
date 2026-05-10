'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Eye, EyeOff, AlertTriangle, Zap } from 'lucide-react'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

const PLANS = [
  {
    id      : 'basic',
    name    : 'Basic',
    price   : 15000,
    desc    : 'Pour démarrer',
    features: ['10 plats au menu', 'Bot WhatsApp complet', 'Paiement Wave', 'Dashboard admin', '1 zone de livraison'],
    popular : false,
  },
  {
    id      : 'pro',
    name    : 'Pro',
    price   : 35000,
    desc    : 'Le plus populaire',
    features: ['25 plats au menu', 'Bot WhatsApp complet', 'Paiement Wave', 'Statistiques avancées', '3 zones de livraison', 'Reçu PDF + email'],
    popular : true,
  },
  {
    id      : 'premium',
    name    : 'Premium',
    price   : 75000,
    desc    : 'Pour les grands restaurants',
    features: ['Plats illimités', 'Bot WhatsApp complet', 'Statistiques + exports', 'Zones illimitées', 'Support prioritaire', 'Onboarding personnalisé'],
    popular : false,
  },
]

function formatFCFA(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

// ── Barre de progression ─────────────────────────────────────────
function ProgressBar({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < step ? 'bg-gray-900' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

// ── Étape 1 — Choix du plan ──────────────────────────────────────
function StepPlan({ selected, onSelect, onNext }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Étape 1 sur 3</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Choisissez votre plan</h1>
      <p className="text-sm text-gray-400 mb-6">Pas de carte bancaire requise. Paiement Wave à l'activation.</p>

      <div className="space-y-3 mb-6">
        {PLANS.map(plan => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
              selected === plan.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">{plan.name}</p>
                {plan.popular && (
                  <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">Populaire</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-gray-900">{formatFCFA(plan.price)}</p>
                <span className="text-xs text-gray-400">/mois</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selected === plan.id ? 'border-gray-900 bg-gray-900' : 'border-gray-200'
                }`}>
                  {selected === plan.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {plan.features.slice(0, 3).map((f, i) => (
                <span key={i} className="text-xs text-gray-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-gray-400" /> {f}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl
                   flex items-center justify-center gap-2 active:scale-[0.98] transition-all
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continuer <ArrowRight size={18} />
      </button>
    </div>
  )
}

// ── Étape 2 — Création du compte ─────────────────────────────────
function StepAccount({ plan, form, setForm, onNext, onBack, loading, error }) {
  const [showPass, setShowPass] = useState(false)

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Étape 2 sur 3</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Créez votre compte</h1>
      <p className="text-sm text-gray-400 mb-6">Plan <strong className="text-gray-700">{plan?.name}</strong> — {formatFCFA(plan?.price || 0)}/mois</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom du restaurant *</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Ex: Chez Fatou"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="vous@email.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Mot de passe *</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Minimum 8 caractères"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Numéro de téléphone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="221771234567"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse du restaurant</label>
          <input
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            placeholder="Plateau, Dakar"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="px-4 py-4 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onNext}
          disabled={loading || !form.name || !form.email || !form.password}
          className="flex-1 bg-gray-900 text-white font-semibold py-4 rounded-2xl
                     flex items-center justify-center gap-2 active:scale-[0.98] transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Créer mon compte</span><ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  )
}

// ── Étape 3 — Config WhatsApp ────────────────────────────────────
function StepWhatsapp({ form, setForm, onNext, onBack, loading, error }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Étape 3 sur 3</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Configurez WhatsApp</h1>
      <p className="text-sm text-gray-400 mb-6">
        Vous pouvez configurer ça maintenant ou plus tard depuis le dashboard.
      </p>

      {/* Guide */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
        <p className="text-xs font-semibold text-blue-800 mb-2">📋 Comment obtenir ces informations ?</p>
        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
          <li>Allez sur <strong>developers.facebook.com</strong></li>
          <li>Créez une app → ajoutez le produit <strong>WhatsApp</strong></li>
          <li>Allez dans <strong>Configuration API</strong></li>
          <li>Copiez le <strong>Phone Number ID</strong> et le <strong>Access Token</strong></li>
        </ol>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number ID</label>
          <input
            value={form.phoneNumberId}
            onChange={e => setForm(f => ({ ...f, phoneNumberId: e.target.value }))}
            placeholder="617864204737769"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Access Token</label>
          <input
            type="password"
            value={form.accessToken}
            onChange={e => setForm(f => ({ ...f, accessToken: e.target.value }))}
            placeholder="EAAxxxxx..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Verify Token</label>
          <input
            value={form.verifyToken}
            onChange={e => setForm(f => ({ ...f, verifyToken: e.target.value }))}
            placeholder="mon_token_secret"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-gray-400 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">Un mot secret de votre choix pour sécuriser le webhook.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="px-4 py-4 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="flex-1 bg-gray-900 text-white font-semibold py-4 rounded-2xl
                     flex items-center justify-center gap-2 active:scale-[0.98] transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading
            ? <Loader2 size={18} className="animate-spin" />
            : <><span>Terminer la configuration</span><ArrowRight size={18} /></>
          }
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={loading}
        className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
      >
        Configurer plus tard depuis le dashboard →
      </button>
    </div>
  )
}

// ── Étape 4 — Succès ─────────────────────────────────────────────
function StepSuccess({ restaurantName, plan }) {
  const router = useRouter()

  return (
    <div className="text-center">
      <style>{`
        @keyframes scaleIn  { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drawRing { from{stroke-dashoffset:220} to{stroke-dashoffset:0} }
        @keyframes drawCheck{ from{stroke-dashoffset:80}  to{stroke-dashoffset:0} }
        .fu1 { animation: fadeUp 0.5s ease 0.3s both }
        .fu2 { animation: fadeUp 0.5s ease 0.5s both }
        .fu3 { animation: fadeUp 0.5s ease 0.7s both }
        .fu4 { animation: fadeUp 0.5s ease 0.9s both }
      `}</style>

      <div className="flex justify-center mb-6" style={{ animation: 'scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="35" fill="none" stroke="#dcfce7" strokeWidth="10" />
          <circle cx="45" cy="45" r="35" fill="none" stroke="#16a34a" strokeWidth="4"
            strokeDasharray="220" strokeDashoffset="220" strokeLinecap="round"
            style={{ animation: 'drawRing 0.6s ease 0.3s forwards' }} />
          <polyline points="28,45 40,57 62,33" fill="none" stroke="#16a34a" strokeWidth="5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="80" strokeDashoffset="80"
            style={{ animation: 'drawCheck 0.4s ease 0.8s forwards' }} />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2 fu1">
        Bienvenue sur Skanema ! 🎉
      </h1>

      <p className="text-sm text-gray-500 mb-2 fu2">
        <strong className="text-gray-700">{restaurantName}</strong> est prêt.
      </p>

      <p className="text-sm text-gray-400 mb-8 fu2">
        Plan <strong className="text-gray-600">{plan}</strong> activé.
        Notre équipe vous contactera pour finaliser le paiement Wave.
      </p>

      <div className="bg-gray-50 rounded-2xl p-4 mb-6 fu3 text-left space-y-2">
        <p className="text-xs font-semibold text-gray-700 mb-3">🚀 Prochaines étapes :</p>
        {[
          'Ajoutez vos plats dans le menu',
          'Configurez vos zones de livraison',
          'Testez le bot en envoyant "menu" sur WhatsApp',
          'Partagez votre lien menu avec vos clients',
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-600">
              {i + 1}
            </div>
            <p className="text-xs text-gray-600">{step}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl
                   flex items-center justify-center gap-2 active:scale-[0.98] transition-all fu4"
      >
        Accéder au dashboard <ArrowRight size={18} />
      </button>
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────
function OnboardingContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const initPlan     = searchParams.get('plan') || ''

  const [step,    setStep]    = useState(initPlan ? 2 : 1)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  const [selectedPlan, setSelectedPlan] = useState(initPlan)
  const [account, setAccount] = useState({ name:'', email:'', password:'', phone:'', address:'' })
  const [whatsapp, setWhatsapp] = useState({ phoneNumberId:'', accessToken:'', verifyToken:'' })

  const plan = PLANS.find(p => p.id === selectedPlan)

  // Étape 2 → créer le compte
  const handleCreateAccount = async () => {
    if (!account.name.trim() || !account.email.trim() || !account.password.trim()) {
      setError('Nom, email et mot de passe sont obligatoires.')
      return
    }
    if (account.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res  = await fetch(`${API_URL}/api/auth/register`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          name    : account.name,
          email   : account.email,
          password: account.password,
          phone   : account.phone,
          address : account.address,
          plan    : selectedPlan,
          whatsappPhoneNumberId: 'A_CONFIGURER',
          whatsappAccessToken  : 'A_CONFIGURER',
          whatsappVerifyToken  : 'skanema_' + Date.now(),
        }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Erreur lors de la création du compte.')
        return
      }
      // Stocke le token JWT
      const isProd = window.location.hostname.includes('skanema.com')
      const opts   = { expires:7, secure:isProd, sameSite:isProd?'None':'Lax', domain:isProd?'.skanema.com':undefined }
      Cookies.set('skanema_token', data.token, opts)
      Cookies.set('skanema_user',  JSON.stringify(data.data), opts)
      setStep(3)
    } catch (_) {
      setError('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  // Étape 3 → configurer WhatsApp (optionnel)
  const handleConfigWhatsapp = async () => {
    setLoading(true)
    setError('')
    try {
      if (whatsapp.phoneNumberId || whatsapp.accessToken) {
        const token = Cookies.get('skanema_token')
        await fetch(`${API_URL}/api/auth/whatsapp`, {
          method : 'PATCH',
          headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
          body   : JSON.stringify({
            phoneNumberId: whatsapp.phoneNumberId || undefined,
            accessToken  : whatsapp.accessToken   || undefined,
            verifyToken  : whatsapp.verifyToken    || undefined,
          }),
        })
      }
      setDone(true)
    } catch (_) {
      // Config WA échouée mais compte créé — on passe quand même
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <StepSuccess restaurantName={account.name} plan={plan?.name || selectedPlan} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-base font-semibold text-gray-900">Skanema</span>
        </div>

        <ProgressBar step={step} total={3} />

        {step === 1 && (
          <StepPlan
            selected={selectedPlan}
            onSelect={setSelectedPlan}
            onNext={() => { setError(''); setStep(2) }}
          />
        )}

        {step === 2 && (
          <StepAccount
            plan={plan}
            form={account}
            setForm={setAccount}
            onNext={handleCreateAccount}
            onBack={() => setStep(1)}
            loading={loading}
            error={error}
          />
        )}

        {step === 3 && (
          <StepWhatsapp
            form={whatsapp}
            setForm={setWhatsapp}
            onNext={handleConfigWhatsapp}
            onBack={() => setStep(2)}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
