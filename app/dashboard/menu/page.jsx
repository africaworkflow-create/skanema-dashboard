'use client'
import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { PlanGate } from '@/components/ui/PlanGate'
import { getMenu, createItem, updateItem, deleteItem, toggleItem } from '@/lib/api'
import { formatFCFA } from '@/lib/utils'
import {
  Plus, Pencil, Trash2, UtensilsCrossed,
  Loader2, X, Clock, AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const CATEGORIES = ['Plats principaux','Entrées','Desserts','Boissons','Accompagnements']

const PLAN_LIMITS = { basic: 10, pro: 25, premium: 999 }

const EMPTY_FORM = {
  name:'', description:'', price:'', category:'Plats principaux',
  imageUrl:'', preparationTime:'30', available:true,
}

export default function MenuPage() {
  const { user }                      = useAuth()
  const currentPlan                   = user?.plan || 'basic'
  const maxItems                      = PLAN_LIMITS[currentPlan] || 10

  const [items,      setItems]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [editing,    setEditing]    = useState(null)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(null)
  const [toggling,   setToggling]   = useState(null)
  const [error,      setError]      = useState('')
  const [deleteConf, setDeleteConf] = useState(null)
  const firstInput                  = useRef(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getMenu()
      setItems(res.data.data || [])
    } catch (_) {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (modal) setTimeout(() => firstInput.current?.focus(), 120) }, [modal])

  const atLimit = items.length >= maxItems

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name, description: item.description,
      price: String(item.price), category: item.category,
      imageUrl: item.imageUrl, preparationTime: String(item.preparationTime),
      available: item.available,
    })
    setError('')
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.imageUrl.trim()) {
      setError('Nom, prix et image sont obligatoires.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        preparationTime: Number(form.preparationTime),
      }
      if (editing) {
        await updateItem(editing._id, payload)
      } else {
        await createItem(payload)
      }
      setModal(false)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (item) => {
    setToggling(item._id)
    try {
      await toggleItem(item._id, !item.available)
      setItems(prev => prev.map(i =>
        i._id === item._id ? { ...i, available: !i.available } : i
      ))
    } catch (_) {}
    finally { setToggling(null) }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await deleteItem(id)
      setItems(prev => prev.filter(i => i._id !== id))
      setDeleteConf(null)
    } catch (_) {}
    finally { setDeleting(null) }
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat)
    if (catItems.length) acc[cat] = catItems
    return acc
  }, {})
  const others = items.filter(i => !CATEGORIES.includes(i.category))
  if (others.length) grouped['Autres'] = others

  return (
    <DashboardLayout
      title="Menu"
      subtitle={`${items.length} / ${maxItems === 999 ? '∞' : maxItems} plats · Plan ${currentPlan}`}
      actions={
        <PlanGate
          currentPlan={currentPlan}
          requiredPlan={atLimit && currentPlan !== 'premium' ? 'pro' : 'basic'}
          feature={`Ajouter plus de ${maxItems} plats`}
        >
          <button
            onClick={openCreate}
            disabled={atLimit && currentPlan === 'premium'}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Ajouter un plat</span>
          </button>
        </PlanGate>
      }
    >
      {/* Barre de progression plan */}
      {maxItems !== 999 && (
        <div className="mb-5 bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Plats utilisés</span>
            <span className="text-xs font-medium text-gray-900">{items.length} / {maxItems}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                items.length / maxItems >= 0.9 ? 'bg-red-400' :
                items.length / maxItems >= 0.7 ? 'bg-amber-400' : 'bg-gray-900'
              }`}
              style={{ width: `${Math.min(100, (items.length / maxItems) * 100)}%` }}
            />
          </div>
          {atLimit && (
            <p className="text-xs text-amber-600 mt-2">
              Limite atteinte. Passez au plan supérieur pour ajouter plus de plats.
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={22} className="animate-spin text-gray-300" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Aucun plat dans le menu"
          description="Ajoutez votre premier plat pour que vos clients puissent commander via WhatsApp."
          action={
            <button onClick={openCreate} className="btn-primary flex items-center gap-2">
              <Plus size={14} /> Ajouter un plat
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">{cat}</h2>
                <span className="text-xs text-gray-300">{catItems.length}</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                {catItems.map((item, i) => (
                  <div
                    key={item._id}
                    className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 ${
                      i < catItems.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <UtensilsCrossed size={16} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        {!item.available && <Badge variant="gray">Indisponible</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm font-medium text-gray-900">
                          {formatFCFA(item.price)}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {item.preparationTime} min
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <Toggle
                        checked={item.available}
                        onChange={() => handleToggle(item)}
                        disabled={toggling === item._id}
                      />
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConf(item)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ajout/édition */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editing ? 'Modifier le plat' : 'Ajouter un plat'}
              </h2>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom du plat *</label>
                <input
                  ref={firstInput}
                  value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="Ex: Thiéboudienne Rouge"
                  className="input"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  placeholder="Décrivez le plat en quelques mots…"
                  rows={3}
                  maxLength={500}
                  className="input resize-none"
                />
                <p className="text-2xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Prix (FCFA) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({...f, price: e.target.value}))}
                    placeholder="3500"
                    min={0}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Préparation (min)</label>
                  <input
                    type="number"
                    value={form.preparationTime}
                    onChange={e => setForm(f => ({...f, preparationTime: e.target.value}))}
                    placeholder="30"
                    min={1}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Catégorie</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  className="input"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Image du plat *</label>
                <ImageUpload
                  value={form.imageUrl}
                  onChange={url => setForm(f => ({...f, imageUrl: url}))}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-gray-900">Disponible</p>
                  <p className="text-xs text-gray-400">Visible dans le menu WhatsApp</p>
                </div>
                <Toggle
                  checked={form.available}
                  onChange={v => setForm(f => ({...f, available: v}))}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setModal(false)} className="btn-ghost flex-1">Annuler</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? 'Enregistrement…' : editing ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {deleteConf && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Supprimer ce plat ?</h3>
            <p className="text-xs text-gray-400 mb-5">
              <strong className="text-gray-700">{deleteConf.name}</strong> sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConf(null)} className="btn-ghost flex-1">Annuler</button>
              <button
                onClick={() => handleDelete(deleteConf._id)}
                disabled={deleting === deleteConf._id}
                className="btn-danger flex-1 flex items-center justify-center gap-2"
              >
                {deleting === deleteConf._id && <Loader2 size={12} className="animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
