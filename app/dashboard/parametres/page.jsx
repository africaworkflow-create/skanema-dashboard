'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Loader2, CheckCircle2, Store, Lock, Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'

const PLAN_LIMITS = { basic: 10, pro: 25, premium: 999 }
const PLAN_PRICE  = { basic: 15000, pro: 35000, premium: 75000 }

export default function ParametresPage() {
  const { user }              = useAuth()
  const [tab,     setTab]     = useState('restaurant')
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [resto,   setResto]   = useState({ name: '', phone: '', address: '' })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passErr,  setPassErr]  = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/auth/me')
        const d   = res.data.data
        setResto({
          name   : d.restaurantName || '',
          phone  : d.phone          || '',
          address: d.address        || '',
        })
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSaveResto = async () => {
    setSaving(true)
    try {
      await api.patch('/api/auth/profile', { name: resto.name, address: resto.address })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (_) {}
    finally { setSaving(false) }
  }

  const handleChangePass = async () => {
    if (!password.current || !password.next) { setPassErr('Remplissez tous les champs.'); return }
    if (password.next !== password.confirm)   { setPassErr('Les mots de passe ne correspondent pas.'); return }
    if (password.next.length < 8)             { setPassErr('Minimum 8 caractères.'); return }
    setPassErr('')
    setSaving(true)
    try {
      await api.patch('/api/auth/password', { currentPassword: password.current, newPassword: password.next })
      setPassword({ current: '', next: '', confirm: '' })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setPassErr(err.response?.data?.message || 'Erreur lors du changement de mot de passe.')
    }
    finally { setSaving(false) }
  }

  // Calcul jours restants essai
  const trialEnds   = user?.subscription?.trialEnds ? new Date(user.subscription.trialEnds) : null
  const now         = new Date()
  const daysLeft    = trialEnds ? Math.max(0, Math.ceil((trialEnds - now) / (1000 * 60 * 60 * 24))) : 0
  const trialTotal  = 14
  const daysUsed    = trialTotal - daysLeft
  const plan        = user?.plan || 'basic'
  const isConfigured = user?.whatsappPhoneNumberId &&
    !user.whatsappPhoneNumberId?.startsWith('PENDING_') &&
    user.whatsappPhoneNumberId !== 'A_CONFIGURER'

  const TABS = [
    { id: 'restaurant', label: 'Restaurant', icon: Store },
    { id: 'securite',   label: 'Sécurité',   icon: Lock  },
    { id: 'notifs',     label: 'Notifications', icon: Bell },
  ]

  if (loading) return (
    <DashboardLayout title="Paramètres" subtitle="Gérez votre compte et votre restaurant">
      <div className="flex justify-center py-20">
        <Loader2 size={22} className="animate-spin text-gray-300" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Paramètres" subtitle="Gérez votre compte et votre restaurant">
      <div className="max-w-2xl space-y-5">

        <div className="flex bg-gray-100 rounded-xl p-1 w-fit gap-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Restaurant */}
        {tab === 'restaurant' && (
          <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Informations du restaurant</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom du restaurant</label>
              <input value={resto.name} onChange={e => setResto(r => ({ ...r, name: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Numéro de téléphone</label>
              <div className="flex items-center gap-2">
                <input
                  value={resto.phone}
                  readOnly
                  className="input bg-gray-50 text-gray-400 cursor-not-allowed flex-1"
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  🔒 Non modifiable
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Pour modifier votre numéro, contactez{' '}
                <a href="https://wa.me/221784632103" target="_blank" rel="noopener noreferrer"
                   className="underline hover:text-gray-600">
                  le support Skanema
                </a>.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse</label>
              <input value={resto.address} onChange={e => setResto(r => ({ ...r, address: e.target.value }))} className="input" />
            </div>
            <button onClick={handleSaveResto} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={13} className="animate-spin" /> : null}
              {saved  ? <><CheckCircle2 size={13} /> Enregistré !</> : 'Enregistrer'}
            </button>
          </div>
        )}

        {/* Sécurité */}
        {tab === 'securite' && (
          <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Changer le mot de passe</h2>
            {[
              { field: 'current', label: 'Mot de passe actuel' },
              { field: 'next',    label: 'Nouveau mot de passe' },
              { field: 'confirm', label: 'Confirmer le nouveau' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type="password"
                  value={password[field]}
                  onChange={e => setPassword(p => ({ ...p, [field]: e.target.value }))}
                  placeholder="••••••••"
                  className="input"
                />
              </div>
            ))}
            {passErr && <p className="text-xs text-red-500">{passErr}</p>}
            {saved   && <p className="text-xs text-green-600">Mot de passe modifié avec succès.</p>}
            <button onClick={handleChangePass} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Loader2 size={13} className="animate-spin" />}
              Modifier le mot de passe
            </button>
          </div>
        )}

        {/* Notifications */}
        {tab === 'notifs' && (
          <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Préférences de notifications</h2>
            {[
              { label: 'Nouvelle commande',  desc: 'Recevoir un message WhatsApp à chaque commande', default: true  },
              { label: 'Paiement confirmé',  desc: 'Notification quand un paiement Wave est validé',  default: true  },
              { label: 'Résumé quotidien',   desc: 'Bilan du jour envoyé à 22h',                     default: false },
            ].map((notif, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-gray-900">{notif.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={notif.default} className="w-4 h-4 rounded accent-gray-900 cursor-pointer" />
              </div>
            ))}
          </div>
        )}

        {/* Plan */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">Plan {plan}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {user?.subscription?.status === 'trial'
                  ? `Essai gratuit · ${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}`
                  : 'Abonnement actif'
                }
              </p>
            </div>
            <span className="text-xs font-medium bg-gray-900 text-white px-3 py-1 rounded-full capitalize">
              {plan}
            </span>
          </div>

          {user?.subscription?.status === 'trial' && (
            <>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gray-900 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (daysUsed / trialTotal) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mb-4">
                {daysUsed} jour{daysUsed > 1 ? 's' : ''} utilisé{daysUsed > 1 ? 's' : ''} sur {trialTotal} jours d'essai
              </p>
            </>
          )}

          <a
            href="https://wa.me/221784632103?text=Bonjour%20Skanema%2C%20je%20souhaite%20passer%20à%20un%20plan%20payant."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 inline-block"
          >
            Passer à un plan payant
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
