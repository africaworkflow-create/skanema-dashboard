'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toggle } from '@/components/ui/Toggle'
import { Loader2, CheckCircle2, Clock, Info } from 'lucide-react'
import api from '@/lib/api'

const DAYS = [
  { key: 'monday',    label: 'Lundi'    },
  { key: 'tuesday',   label: 'Mardi'    },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday',  label: 'Jeudi'    },
  { key: 'friday',    label: 'Vendredi' },
  { key: 'saturday',  label: 'Samedi'   },
  { key: 'sunday',    label: 'Dimanche' },
]

const DEFAULT_SCHEDULE = Object.fromEntries(
  DAYS.map(d => [d.key, { open: true, from: '08:00', to: '22:00' }])
)

export default function HorairesPage() {
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [enabled,  setEnabled]  = useState(false)
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await api.get('/api/auth/opening-hours')
        const data = res.data.data
        if (data.enabled !== undefined) setEnabled(data.enabled)
        if (data.schedule) {
          // Mongoose Map → objet JS
          const sched = data.schedule instanceof Map
            ? Object.fromEntries(data.schedule)
            : data.schedule
          setSchedule({ ...DEFAULT_SCHEDULE, ...sched })
        }
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleDayToggle = (day) => {
    setSchedule(s => ({ ...s, [day]: { ...s[day], open: !s[day].open } }))
  }

  const handleTime = (day, field, value) => {
    setSchedule(s => ({ ...s, [day]: { ...s[day], [field]: value } }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch('/api/auth/opening-hours', { enabled, schedule })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (_) {}
    finally { setSaving(false) }
  }

  if (loading) return (
    <DashboardLayout title="Horaires d'ouverture" subtitle="Configurez vos heures de service">
      <div className="flex justify-center py-20">
        <Loader2 size={22} className="animate-spin text-gray-300" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Horaires d'ouverture" subtitle="Configurez vos heures de service">
      <div className="max-w-2xl space-y-5">

        {/* Activation */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Activer les horaires</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {enabled
                  ? 'Le bot refuse les commandes en dehors des horaires configurés.'
                  : 'Le bot accepte les commandes 24h/24 — aucune restriction.'}
              </p>
            </div>
            <Toggle checked={enabled} onChange={() => setEnabled(e => !e)} />
          </div>
        </div>

        {/* Info */}
        {!enabled && (
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Activez les horaires pour que le bot informe automatiquement vos clients quand vous êtes fermés.
            </p>
          </div>
        )}

        {/* Planning */}
        <div className={`bg-white border border-gray-100 rounded-xl overflow-hidden transition-opacity ${!enabled ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            <p className="text-sm font-semibold text-gray-900">Planning hebdomadaire</p>
          </div>

          <div className="divide-y divide-gray-50">
            {DAYS.map(({ key, label }) => {
              const day = schedule[key] || { open: true, from: '08:00', to: '22:00' }
              return (
                <div key={key} className="flex items-center gap-4 px-5 py-3.5">
                  {/* Jour + toggle */}
                  <div className="flex items-center gap-3 w-32 flex-shrink-0">
                    <Toggle
                      checked={day.open}
                      onChange={() => handleDayToggle(key)}
                    />
                    <span className={`text-sm font-medium ${day.open ? 'text-gray-900' : 'text-gray-300'}`}>
                      {label}
                    </span>
                  </div>

                  {/* Horaires */}
                  {day.open ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={day.from}
                        onChange={e => handleTime(key, 'from', e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                                   outline-none focus:border-gray-400 transition-colors"
                      />
                      <span className="text-xs text-gray-400">→</span>
                      <input
                        type="time"
                        value={day.to}
                        onChange={e => handleTime(key, 'to', e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                                   outline-none focus:border-gray-400 transition-colors"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300 italic flex-1">Fermé</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl
                     flex items-center justify-center gap-2 hover:bg-gray-800
                     active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {saving  ? <Loader2 size={18} className="animate-spin" /> : null}
          {saved   ? <><CheckCircle2 size={18} /> Horaires enregistrés !</> : 'Enregistrer les horaires'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Fuseau horaire : Africa/Dakar (GMT+0)
        </p>
      </div>
    </DashboardLayout>
  )
}
