'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toggle } from '@/components/ui/Toggle'
import { AddressSearch } from '@/components/ui/AddressSearch'
import { formatFCFA } from '@/lib/utils'
import { MapPin, Plus, Pencil, Trash2, X, Loader2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'
import { getZones, updateZones } from '@/lib/api'

export default function ZonesPage() {
  const [zones,    setZones]    = useState([])
  const [position, setPosition] = useState({ latitude: 14.6937, longitude: -17.4441 })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [savedPos, setSavedPos] = useState(false)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState({ name: '', radiusKm: '', fee: '', active: true })
  const [error,    setError]    = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getZones()
        setZones(res.data.zones || [])
        if (res.data.location) setPosition(res.data.location)
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const saveZones = async (newZones) => {
    try { await updateZones({ zones: newZones }) } catch (_) {}
  }

  const openCreate = () => {
    setEditing(null); setForm({ name: '', radiusKm: '', fee: '', active: true }); setError(''); setModal(true)
  }

  const openEdit = (z, i) => {
    setEditing(i); setForm({ name: z.name, radiusKm: String(z.radiusKm), fee: String(z.fee), active: z.active }); setError(''); setModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.radiusKm || !form.fee) { setError('Tous les champs sont obligatoires.'); return }
    setSaving(true)
    let newZones
    if (editing !== null) {
      newZones = zones.map((z, i) => i === editing
        ? { ...z, name: form.name, radiusKm: Number(form.radiusKm), fee: Number(form.fee), active: form.active }
        : z
      )
    } else {
      newZones = [...zones, { name: form.name, radiusKm: Number(form.radiusKm), fee: Number(form.fee), active: true }]
    }
    await saveZones(newZones)
    setZones(newZones)
    setSaving(false); setModal(false)
  }

  const handleDelete = async (i) => {
    const newZones = zones.filter((_, idx) => idx !== i)
    await saveZones(newZones)
    setZones(newZones)
  }

  const handleToggle = async (i) => {
    const newZones = zones.map((z, idx) => idx === i ? { ...z, active: !z.active } : z)
    await saveZones(newZones)
    setZones(newZones)
  }

  const handleSavePosition = async () => {
    console.log('Position à sauvegarder:', position)
    setSaving(true)
    try {
      await updateZones({ latitude: position.latitude, longitude: position.longitude })
      setSavedPos(true)
      setTimeout(() => setSavedPos(false), 2500)
    } catch (_) {}
    finally { setSaving(false) }
  }

  if (loading) return (
    <DashboardLayout title="Zones de livraison" subtitle="Configurez vos zones et tarifs">
      <div className="flex justify-center py-20"><Loader2 size={22} className="animate-spin text-gray-300" /></div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout
      title="Zones de livraison"
      subtitle="Configurez vos zones et tarifs"
      actions={
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> <span className="hidden sm:inline">Ajouter une zone</span>
        </button>
      }
    >
      <div className="space-y-5 max-w-2xl">

        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Les zones sont calculées automatiquement depuis la position de votre restaurant.
            Un client hors zone sera informé que la livraison n'est pas disponible.
          </p>
        </div>

        {/* Zones */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {zones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <MapPin size={24} className="text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Aucune zone configurée</p>
              <button onClick={openCreate} className="mt-3 text-xs text-gray-900 font-medium underline">
                Ajouter votre première zone
              </button>
            </div>
          ) : zones.map((zone, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i < zones.length-1 ? 'border-b border-gray-50' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{zone.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Jusqu'à {zone.radiusKm} km · {formatFCFA(zone.fee)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Toggle checked={zone.active} onChange={() => handleToggle(i)} />
                <button onClick={() => openEdit(zone, i)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"><Pencil size={14}/></button>
                <button onClick={() => handleDelete(i)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>

        {/* Position restaurant */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-0.5">Position du restaurant</p>
            <p className="text-xs text-gray-400">Point de départ pour le calcul des distances.</p>
          </div>
          <AddressSearch
            latitude={position.latitude}
            longitude={position.longitude}
            onSelect={({ latitude, longitude }) => setPosition({ latitude, longitude })}
          />
          <button onClick={handleSavePosition} disabled={saving}
            className="btn-primary flex items-center gap-2 text-xs py-2">
            {saving    ? <Loader2 size={12} className="animate-spin" /> : null}
            {savedPos  ? <><CheckCircle2 size={12}/> Position enregistrée !</> : 'Enregistrer la position'}
          </button>
        </div>
      </div>

      {/* Modal zone */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">{editing !== null ? 'Modifier la zone' : 'Nouvelle zone'}</h2>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={15}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom de la zone</label>
                <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Zone A — Centre-ville" className="input"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Rayon maximum (km)</label>
                <input type="number" value={form.radiusKm} onChange={e => setForm(f=>({...f,radiusKm:e.target.value}))} placeholder="5" min={1} className="input"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Frais de livraison (FCFA)</label>
                <input type="number" value={form.fee} onChange={e => setForm(f=>({...f,fee:e.target.value}))} placeholder="1500" min={0} className="input"/>
              </div>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <AlertTriangle size={13} className="text-red-500"/>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(false)} className="btn-ghost flex-1">Annuler</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={13} className="animate-spin"/>}
                  {editing !== null ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
