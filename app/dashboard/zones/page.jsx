'use client'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toggle } from '@/components/ui/Toggle'
import { AddressSearch } from '@/components/ui/AddressSearch'
import { formatFCFA } from '@/lib/utils'
import { MapPin, Plus, Pencil, Trash2, X, Loader2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

const INITIAL_ZONES = [
  { id:'1', name:'Zone A — Centre',          radiusKm:3,  fee:1000, active:true },
  { id:'2', name:'Zone B — Banlieue proche', radiusKm:7,  fee:2000, active:true },
  { id:'3', name:'Zone C — Grande banlieue', radiusKm:15, fee:3000, active:true },
]

export default function ZonesPage() {
  const [zones,    setZones]    = useState(INITIAL_ZONES)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState({ name:'', radiusKm:'', fee:'' })
  const [saving,   setSaving]   = useState(false)
  const [savedPos, setSavedPos] = useState(false)
  const [error,    setError]    = useState('')
  const [position, setPosition] = useState({ latitude:14.6937, longitude:-17.4441 })

  const openCreate = () => {
    setEditing(null); setForm({ name:'', radiusKm:'', fee:'' }); setError(''); setModal(true)
  }
  const openEdit = (z) => {
    setEditing(z); setForm({ name:z.name, radiusKm:String(z.radiusKm), fee:String(z.fee) }); setError(''); setModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.radiusKm || !form.fee) { setError('Tous les champs sont obligatoires.'); return }
    setSaving(true)
    setTimeout(() => {
      if (editing) {
        setZones(prev => prev.map(z => z.id === editing.id
          ? { ...z, name:form.name, radiusKm:Number(form.radiusKm), fee:Number(form.fee) } : z
        ))
      } else {
        setZones(prev => [...prev, { id:String(Date.now()), name:form.name, radiusKm:Number(form.radiusKm), fee:Number(form.fee), active:true }])
      }
      setSaving(false); setModal(false)
    }, 600)
  }

  const handleSavePosition = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSavedPos(true); setTimeout(() => setSavedPos(false), 2500) }, 700)
  }

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
            <p className="text-sm text-gray-400 text-center py-10">Aucune zone configurée.</p>
          ) : zones.map((zone, i) => (
            <div key={zone.id} className={`flex items-center gap-4 px-5 py-4 ${i < zones.length-1 ? 'border-b border-gray-50':''}`}>
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{zone.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Jusqu'à {zone.radiusKm} km · {formatFCFA(zone.fee)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Toggle checked={zone.active} onChange={() => setZones(prev => prev.map(z => z.id===zone.id ? {...z,active:!z.active} : z))} />
                <button onClick={() => openEdit(zone)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"><Pencil size={14}/></button>
                <button onClick={() => setZones(prev => prev.filter(z => z.id!==zone.id))} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>

        {/* Position restaurant avec AddressSearch */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-0.5">Position du restaurant</p>
            <p className="text-xs text-gray-400">Point de départ pour le calcul des distances de livraison.</p>
          </div>
          <AddressSearch
            latitude={position.latitude}
            longitude={position.longitude}
            onSelect={({ latitude, longitude }) => setPosition({ latitude, longitude })}
          />
          <button
            onClick={handleSavePosition}
            disabled={saving}
            className="btn-primary flex items-center gap-2 text-xs py-2"
          >
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
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Modifier la zone' : 'Nouvelle zone'}</h2>
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
                  {editing ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
