'use client'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toggle } from '@/components/ui/Toggle'
import { Loader2, CheckCircle2, MessageCircle, Webhook, Key, Wifi, WifiOff } from 'lucide-react'

export default function WhatsAppPage() {
  const [status,  setStatus]  = useState('connected')
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [form,    setForm]    = useState({
    phoneNumberId: '617864204737769',
    accessToken  : '••••••••••••••••••••',
    verifyToken  : 'skanema_verify_2026',
    apiVersion   : 'v19.0',
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 900)
  }

  return (
    <DashboardLayout
      title="Configuration WhatsApp"
      subtitle="Gérez votre connexion à WhatsApp Cloud API"
    >
      <div className="max-w-2xl space-y-5">

        {/* Statut connexion */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          status === 'connected'
            ? 'bg-green-50 border-green-100'
            : 'bg-red-50 border-red-100'
        }`}>
          {status === 'connected'
            ? <Wifi size={18} className="text-green-600 flex-shrink-0" />
            : <WifiOff size={18} className="text-red-500 flex-shrink-0" />
          }
          <div>
            <p className={`text-sm font-medium ${status === 'connected' ? 'text-green-800' : 'text-red-700'}`}>
              {status === 'connected' ? 'Bot connecté et actif' : 'Bot déconnecté'}
            </p>
            <p className={`text-xs mt-0.5 ${status === 'connected' ? 'text-green-600' : 'text-red-500'}`}>
              {status === 'connected'
                ? 'Votre numéro WhatsApp reçoit et répond aux messages.'
                : 'Vérifiez vos credentials et la configuration du webhook.'
              }
            </p>
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Key size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Credentials API</h2>
          </div>

          {[
            { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text',     placeholder: '617864204737769' },
            { key: 'accessToken',   label: 'Access Token',    type: 'password', placeholder: 'EAAxxxxxx' },
            { key: 'verifyToken',   label: 'Verify Token',    type: 'text',     placeholder: 'mon_token_secret' },
            { key: 'apiVersion',    label: 'Version API',     type: 'text',     placeholder: 'v19.0' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
                placeholder={field.placeholder}
                className="input font-mono text-xs"
              />
            </div>
          ))}

          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving  ? <Loader2 size={13} className="animate-spin" /> : null}
            {saved   ? <><CheckCircle2 size={13} /> Enregistré !</> : 'Enregistrer'}
          </button>
        </div>

        {/* Webhook */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Webhook size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">URL du Webhook</h2>
          </div>
          <p className="text-xs text-gray-400">
            Copiez cette URL dans votre dashboard Meta → WhatsApp → Configuration → Webhooks.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 font-mono text-xs text-gray-700 break-all">
            {process.env.NEXT_PUBLIC_API_URL || 'https://votre-domaine.com'}/webhook/whatsapp
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <div>
              <p className="text-2xs text-gray-400 mb-0.5">Événements requis</p>
              <p className="font-medium text-gray-700">messages</p>
            </div>
            <div>
              <p className="text-2xs text-gray-400 mb-0.5">Mode</p>
              <p className="font-medium text-gray-700">subscribe</p>
            </div>
          </div>
        </div>

        {/* Carrousel template */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Template Carrousel</h2>
            </div>
            <span className="text-2xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
              En attente approbation
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Le carrousel natif WhatsApp nécessite un template approuvé par Meta (~24h).
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom du template</label>
            <input className="input" placeholder="skanema_menu_carousel" defaultValue="" />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-900">Activer le carrousel</p>
              <p className="text-xs text-gray-400">Une fois le template approuvé par Meta</p>
            </div>
            <Toggle checked={false} onChange={() => {}} />
          </div>
          <button className="btn-ghost text-xs py-2">Soumettre le template à Meta</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
