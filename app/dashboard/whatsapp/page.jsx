'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toggle } from '@/components/ui/Toggle'
import { Loader2, CheckCircle2, MessageCircle, Webhook, Key, Wifi, WifiOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'

export default function WhatsAppPage() {
  const { user }              = useAuth()
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({
    phoneNumberId: '',
    accessToken  : '',
    verifyToken  : '',
    apiVersion   : 'v19.0',
  })

  // Statut bot — actif seulement si phoneNumberId n'est pas PENDING_ ou A_CONFIGURER
  const isConfigured = form.phoneNumberId &&
    !form.phoneNumberId.startsWith('PENDING_') &&
    form.phoneNumberId !== 'A_CONFIGURER'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/auth/me')
        const d   = res.data.data
        setForm({
          phoneNumberId: d.whatsappPhoneNumberId || '',
          accessToken  : '',
          verifyToken  : d.whatsappVerifyToken   || '',
          apiVersion   : d.whatsappApiVersion    || 'v19.0',
        })
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch('/api/auth/whatsapp', {
        phoneNumberId: form.phoneNumberId,
        accessToken  : form.accessToken || undefined,
        verifyToken  : form.verifyToken,
        apiVersion   : form.apiVersion,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (_) {}
    finally { setSaving(false) }
  }

  const webhookUrl = `https://api.skanema.com/webhook/whatsapp`

  if (loading) return (
    <DashboardLayout title="Configuration WhatsApp" subtitle="Gérez votre connexion à WhatsApp Cloud API">
      <div className="flex justify-center py-20">
        <Loader2 size={22} className="animate-spin text-gray-300" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Configuration WhatsApp" subtitle="Gérez votre connexion à WhatsApp Cloud API">
      <div className="max-w-2xl space-y-5">

        {/* Statut connexion */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          isConfigured ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'
        }`}>
          {isConfigured
            ? <Wifi size={18} className="text-green-600 flex-shrink-0" />
            : <WifiOff size={18} className="text-amber-500 flex-shrink-0" />
          }
          <div>
            <p className={`text-sm font-medium ${isConfigured ? 'text-green-800' : 'text-amber-700'}`}>
              {isConfigured ? 'Bot configuré et actif' : 'Bot en attente de configuration'}
            </p>
            <p className={`text-xs mt-0.5 ${isConfigured ? 'text-green-600' : 'text-amber-600'}`}>
              {isConfigured
                ? 'Votre numéro WhatsApp reçoit et répond aux messages.'
                : 'Notre équipe Skanema va configurer votre bot sous 24h.'
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
            { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text',     placeholder: '617864204737769', show: true },
            { key: 'accessToken',   label: 'Access Token',    type: 'password', placeholder: 'Laisser vide pour ne pas changer', show: true },
            { key: 'verifyToken',   label: 'Verify Token',    type: 'text',     placeholder: 'mon_token_secret', show: true },
            { key: 'apiVersion',    label: 'Version API',     type: 'text',     placeholder: 'v19.0', show: true },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="input font-mono text-xs"
              />
            </div>
          ))}

          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 size={13} className="animate-spin" /> : null}
            {saved  ? <><CheckCircle2 size={13} /> Enregistré !</> : 'Enregistrer'}
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
          <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 font-mono text-xs text-gray-700 break-all select-all">
            {webhookUrl}
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
      </div>
    </DashboardLayout>
  )
}
