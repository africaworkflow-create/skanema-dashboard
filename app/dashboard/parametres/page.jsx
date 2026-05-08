'use client'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Loader2, CheckCircle2, Store, Lock, Bell } from 'lucide-react'

export default function ParametresPage() {
  const [tab,      setTab]      = useState('restaurant')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [resto,    setResto]    = useState({ name: 'Chez Fatou', phone: '221771234567', address: 'Plateau, Dakar' })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passErr,  setPassErr]  = useState('')

  const handleSaveResto = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 800)
  }

  const handleChangePass = () => {
    if (!password.current || !password.next) { setPassErr('Remplissez tous les champs.'); return }
    if (password.next !== password.confirm)   { setPassErr('Les mots de passe ne correspondent pas.'); return }
    if (password.next.length < 8)             { setPassErr('Minimum 8 caractères.'); return }
    setPassErr('')
    setSaving(true)
    setTimeout(() => { setSaving(false); setPassword({ current: '', next: '', confirm: '' }) }, 800)
  }

  const TABS = [
    { id: 'restaurant', label: 'Restaurant',   icon: Store },
    { id: 'securite',   label: 'Sécurité',     icon: Lock  },
    { id: 'notifs',     label: 'Notifications', icon: Bell  },
  ]

  return (
    <DashboardLayout title="Paramètres" subtitle="Gérez votre compte et votre restaurant">
      <div className="max-w-2xl space-y-5">

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 w-fit gap-0.5">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
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
              <input value={resto.name} onChange={e => setResto(r => ({...r, name: e.target.value}))} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Numéro de téléphone (notifications)</label>
              <input value={resto.phone} onChange={e => setResto(r => ({...r, phone: e.target.value}))} className="input" placeholder="221771234567" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse</label>
              <input value={resto.address} onChange={e => setResto(r => ({...r, address: e.target.value}))} className="input" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSaveResto}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle2 size={13} /> : null}
                {saved ? 'Enregistré !' : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}

        {/* Sécurité */}
        {tab === 'securite' && (
          <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Changer le mot de passe</h2>
            {['current','next','confirm'].map((field, i) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le nouveau'][i]}
                </label>
                <input
                  type="password"
                  value={password[field]}
                  onChange={e => setPassword(p => ({...p, [field]: e.target.value}))}
                  placeholder="••••••••"
                  className="input"
                />
              </div>
            ))}
            {passErr && <p className="text-xs text-red-500">{passErr}</p>}
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
              { label: 'Nouvelle commande',       desc: 'Recevoir un message WhatsApp à chaque commande',     key: 'newOrder',   default: true  },
              { label: 'Paiement confirmé',        desc: 'Notification quand un paiement Wave est validé',     key: 'payment',    default: true  },
              { label: 'Résumé quotidien',         desc: 'Bilan du jour envoyé à 22h',                        key: 'daily',      default: false },
              { label: 'Alertes stock',            desc: 'Quand un plat est commandé 10+ fois dans la journée',key: 'stock',      default: false },
            ].map(notif => (
              <div key={notif.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-gray-900">{notif.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={notif.default} className="w-4 h-4 rounded accent-gray-900 cursor-pointer" />
              </div>
            ))}
            <button className="btn-primary text-xs py-2">Enregistrer</button>
          </div>
        )}

        {/* Plan */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Plan Premium</p>
              <p className="text-xs text-gray-400 mt-0.5">Essai gratuit · 11 jours restants</p>
            </div>
            <span className="text-xs font-medium bg-gray-900 text-white px-3 py-1 rounded-full">Premium</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gray-900 rounded-full" style={{ width: '21%' }} />
          </div>
          <p className="text-xs text-gray-400 mb-4">3 jours utilisés sur 14 jours d'essai</p>
          <button className="btn-primary text-xs py-2">Passer à un plan payant</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
