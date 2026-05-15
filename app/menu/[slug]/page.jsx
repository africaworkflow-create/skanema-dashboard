'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Search, Clock, ChevronLeft, Plus, Minus, Trash2, ArrowRight, Loader2, MapPin, X, CheckCircle2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

function formatFCFA(n) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

// ── Fiche détail plat avec options ──────────────────────────────
function ItemDetail({ item, onClose, onAdd }) {
  const [qty,       setQty]       = useState(1)
  const [selected,  setSelected]  = useState({}) // groupId -> [choiceIndex]
  const [imgError,  setImgError]  = useState(false)

  const groups = item.optionGroups || []

  const toggleChoice = (gi, ci, multiple) => {
    setSelected(prev => {
      const current = prev[gi] || []
      if (multiple) {
        return { ...prev, [gi]: current.includes(ci) ? current.filter(x => x !== ci) : [...current, ci] }
      }
      return { ...prev, [gi]: current.includes(ci) ? [] : [ci] }
    })
  }

  const extraTotal = groups.reduce((sum, g, gi) => {
    const sel = selected[gi] || []
    return sum + sel.reduce((s, ci) => s + (Number(g.choices[ci]?.extraPrice) || 0), 0)
  }, 0)

  const unitPrice = item.price + extraTotal
  const total     = unitPrice * qty

  const canAdd = groups.every((g, gi) => !g.required || (selected[gi] || []).length > 0)

  const handleAdd = () => {
    if (!canAdd) return
    const options = groups.reduce((acc, g, gi) => {
      const sel = selected[gi] || []
      if (sel.length > 0) {
        acc.push({ group: g.name, choices: sel.map(ci => g.choices[ci].label) })
      }
      return acc
    }, [])
    onAdd(item, qty, unitPrice, options)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
           style={{ animation: 'slideUp 0.25s ease' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        {/* Image */}
        <div className="relative flex-shrink-0" style={{ height: '200px' }}>
          {!imgError && item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-6xl">🍽️</div>
          )}
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock size={10} />{item.preparationTime} min
          </div>
        </div>

        {/* Contenu */}
        <div className="overflow-y-auto flex-1 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{item.description}</p>

          {/* Groupes d'options */}
          {groups.map((group, gi) => (
            <div key={gi} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-semibold text-gray-900">{group.name}</p>
                {group.required && (
                  <span className="text-2xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Obligatoire</span>
                )}
                {group.multiple && (
                  <span className="text-2xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Plusieurs choix</span>
                )}
              </div>
              <div className="space-y-2">
                {group.choices.map((choice, ci) => {
                  const isSelected = (selected[gi] || []).includes(ci)
                  return (
                    <button
                      key={ci}
                      onClick={() => toggleChoice(gi, ci, group.multiple)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                        isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <span className="text-sm text-gray-900">{choice.label}</span>
                      <div className="flex items-center gap-3">
                        {choice.extraPrice > 0 && (
                          <span className="text-xs text-gray-500">+{formatFCFA(choice.extraPrice)}</span>
                        )}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-gray-100">
          {/* Quantité */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Quantité</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center active:scale-90 transition-all">
                <Minus size={14} className="text-gray-600" />
              </button>
              <span className="text-base font-bold text-gray-900 w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center active:scale-90 transition-all">
                <Plus size={14} className="text-white" />
              </button>
            </div>
          </div>

          {!canAdd && (
            <p className="text-xs text-red-500 text-center mb-3">Veuillez compléter les choix obligatoires</p>
          )}

          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-between px-5 active:scale-[0.98] transition-all disabled:opacity-50"
            style={{ background: canAdd ? '#075E54' : '#9ca3af' }}
          >
            <span>Ajouter au panier</span>
            <span>{formatFCFA(total)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Carte plat — layout liste ────────────────────────────────────
function DishCard({ item, qty, onOpen, onAddDirect, onRemoveDirect }) {
  const [imgError, setImgError] = useState(false)
  const hasOptions = (item.optionGroups || []).length > 0

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-stretch"
      style={{ minHeight: '100px' }}
    >
      {/* Image cliquable → fiche détail */}
      <div
        onClick={() => onOpen(item)}
        className="relative flex-shrink-0 cursor-pointer active:opacity-80 transition-opacity"
        style={{ width: '110px' }}
      >
        {!imgError && item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={() => setImgError(true)} loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-4xl">🍽️</div>
        )}
        {qty > 0 && (
          <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {qty}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div onClick={() => onOpen(item)} className="flex-1 p-3 flex flex-col justify-between min-w-0 cursor-pointer">
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-bold text-gray-900">{formatFCFA(item.price)}</p>
          {!hasOptions && qty > 0 ? (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <button onClick={() => onRemoveDirect(item)}
                className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center active:scale-90 transition-all">
                <Minus size={12} className="text-gray-600" />
              </button>
              <span className="text-sm font-bold text-gray-900 w-4 text-center">{qty}</span>
              <button onClick={() => onAddDirect(item)}
                className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center active:scale-90 transition-all">
                <Plus size={12} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={e => {
                e.stopPropagation()
                if (hasOptions) { onOpen(item) } else { onAddDirect(item) }
              }}
              className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all"
            >
              <Plus size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Vue panier ───────────────────────────────────────────────────
function CartView({ cart, restaurant, onBack, onAdd, onRemove, slug, sid }) {
  const items    = Object.values(cart).filter(i => i.qty > 0)
  const subtotal = items.reduce((s, i) => s + (i.unitPrice || i.price) * i.qty, 0)

  const [ordering,     setOrdering]     = useState(false)
  const [orderError,   setOrderError]   = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  const handleOrder = async () => {
    setOrdering(true)
    setOrderError('')
    try {
      const payload = {
        slug,
        sid : sid || null,
        items: items.map(i => ({ menuItemId: i.id, quantity: i.qty, options: i.options || [] }))
      }
      const res  = await fetch(`${API_URL}/api/public/order/create`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) { setOrderError(data.message || 'Erreur lors de la création de la commande.'); return }
      if (data.sent) {
        setOrderSuccess(true)
      } else {
        const phone = restaurant.phone?.replace(/\D/g, '') || ''
        window.location.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(data.token)
      }
    } catch (_) {
      setOrderError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setOrdering(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-white"
           style={{ animation: 'fadeIn 0.4s ease' }}>
        <style>{`
          @keyframes fadeIn   { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
          @keyframes scaleIn  { 0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)} }
          @keyframes drawRing { from{stroke-dashoffset:220}to{stroke-dashoffset:0} }
          @keyframes drawCheck{ from{stroke-dashoffset:80}to{stroke-dashoffset:0} }
        `}</style>
        <div style={{ animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }} className="mb-6">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="35" fill="none" stroke="#dcfce7" strokeWidth="10" />
            <circle cx="45" cy="45" r="35" fill="none" stroke="#16a34a" strokeWidth="4"
              strokeDasharray="220" strokeDashoffset="220" strokeLinecap="round"
              style={{ animation: 'drawRing 0.6s ease 0.2s forwards' }} />
            <polyline points="28,45 40,57 62,33" fill="none" stroke="#16a34a" strokeWidth="5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="80" strokeDashoffset="80"
              style={{ animation: 'drawCheck 0.4s ease 0.7s forwards' }} />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ animation: 'fadeIn 0.5s ease 0.3s both' }}>Commande envoyée !</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ animation: 'fadeIn 0.5s ease 0.5s both' }}>
          Vérifiez WhatsApp — le bot vous a envoyé votre commande automatiquement.
        </p>
        <p className="text-xs text-gray-400" style={{ animation: 'fadeIn 0.5s ease 0.7s both' }}>
          Pour une nouvelle commande, tapez <strong className="text-gray-600">menu</strong> sur WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Mon panier</h2>
          <p className="text-xs text-gray-400">{items.length} article{items.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-sm font-medium text-gray-700">Panier vide</p>
            <button onClick={onBack} className="mt-4 text-sm font-medium text-gray-900 border border-gray-200 px-4 py-2 rounded-xl">
              Voir le menu
            </button>
          </div>
        ) : items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
              {item.options && item.options.length > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.options.map(o => o.choices.join(', ')).join(' · ')}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{formatFCFA(item.unitPrice)} / unité</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{formatFCFA(item.unitPrice * item.qty)}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => onRemove(item)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center active:scale-90 transition-all">
                {item.qty === 1 ? <Trash2 size={13} className="text-red-400" /> : <Minus size={13} className="text-gray-600" />}
              </button>
              <span className="text-sm font-bold text-gray-900 w-5 text-center">{item.qty}</span>
              <button onClick={() => onAdd(item, 1, item.unitPrice, item.options || [])}
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center active:scale-90 transition-all">
                <Plus size={13} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="bg-white border-t border-gray-100 px-4 pt-4 pb-8 flex-shrink-0">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-medium text-gray-900">{formatFCFA(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1"><MapPin size={12} /> Livraison</span>
              <span className="text-gray-400">Calculée à la commande</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-3 mt-2">
              <span>Total estimé</span>
              <span>{formatFCFA(subtotal)}</span>
            </div>
          </div>

          {orderError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-red-600 text-center">{orderError}</p>
            </div>
          )}

          <button onClick={handleOrder} disabled={ordering}
            className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
            style={{ background: '#075E54' }}>
            {ordering ? (
              <><Loader2 size={20} className="animate-spin" /> Préparation de la commande…</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Commander via WhatsApp
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            {sid ? 'Votre commande sera envoyée automatiquement sur WhatsApp' : 'Vous serez redirigé vers WhatsApp'}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────
export default function MenuPage() {
  const { slug }     = useParams()
  const searchParams = useSearchParams()
  const sid          = searchParams.get('sid')

  const [restaurant, setRestaurant] = useState(null)
  const [menuItems,  setMenuItems]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [cart,       setCart]       = useState({})
  const [search,     setSearch]     = useState('')
  const [activeCat,  setActiveCat]  = useState('Tous')
  const [showCart,   setShowCart]   = useState(false)
  const [detail,     setDetail]     = useState(null) // plat ouvert en fiche détail

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/menu/${slug}`)
        if (!res.ok) throw new Error('Restaurant introuvable')
        const data = await res.json()
        setRestaurant(data.restaurant)
        setMenuItems(data.items)
      } catch (err) { setError(err.message) }
      finally { setLoading(false) }
    }
    load()
  }, [slug])

  useEffect(() => {
    const saved = sessionStorage.getItem('skanema_cart_' + slug)
    if (saved) { try { setCart(JSON.parse(saved)) } catch (_) {} }
  }, [slug])

  useEffect(() => {
    sessionStorage.setItem('skanema_cart_' + slug, JSON.stringify(cart))
  }, [cart, slug])

  // Ajoute au panier avec options — clé unique par item+options
  const addToCart = useCallback((item, qty = 1, unitPrice = null, options = []) => {
    const price      = unitPrice !== null ? unitPrice : item.price
    const baseKey    = item._id || item.id
    // Clé unique = id + options choisies (pour différencier même plat avec options différentes)
    const optionsKey = options.length > 0
      ? options.map(o => o.choices.join(',')).join('|')
      : ''
    const key = optionsKey ? baseKey + '_' + optionsKey.replace(/[^a-zA-Z0-9]/g, '') : baseKey
    setCart(prev => ({
      ...prev,
      [key]: {
        id       : baseKey,
        cartKey  : key,
        name     : item.name,
        price    : item.price,
        unitPrice: price,
        imageUrl : item.imageUrl,
        options  : options,
        qty      : (prev[key]?.qty || 0) + qty,
      }
    }))
  }, [])

  const removeFromCart = useCallback((item) => {
    const key = item.cartKey || item._id || item.id
    setCart(prev => {
      const current = prev[key]?.qty || 0
      if (current <= 1) { const next = { ...prev }; delete next[key]; return next }
      return { ...prev, [key]: { ...prev[key], qty: current - 1 } }
    })
  }, [])

  const cartCount = Object.values(cart).reduce((s, i) => s + i.qty, 0)
  const cartTotal = Object.values(cart).reduce((s, i) => s + (i.unitPrice || i.price) * i.qty, 0)

  const categories = ['Tous', ...new Set(menuItems.map(i => i.category).filter(Boolean))]
  const filtered   = menuItems.filter(item =>
    (activeCat === 'Tous' || item.category === activeCat) &&
    (!search || item.name.toLowerCase().includes(search.toLowerCase())) &&
    item.available
  )

  // Statut ouverture
  const isOpen = restaurant?.isOpen !== false
  const openHint = restaurant?.openHint || ''

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="space-y-3 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden flex" style={{ height: '100px' }}>
            <Skeleton className="w-28 h-full rounded-none" />
            <div className="p-3 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-5xl mb-4">😔</div>
      <h1 className="text-lg font-semibold text-gray-900 mb-2">Restaurant introuvable</h1>
      <p className="text-sm text-gray-400">{error}</p>
    </div>
  )

  if (showCart) return (
    <CartView cart={cart} restaurant={restaurant} onBack={() => setShowCart(false)}
      onAdd={addToCart} onRemove={removeFromCart} slug={slug} sid={sid} />
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ maxWidth: '480px', margin: '0 auto' }}>

      {/* Header restaurant */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900">{restaurant?.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-400'}`} />
                <span className={`text-xs font-medium ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                  {isOpen ? 'Ouvert' : 'Fermé'}
                </span>
                {openHint && <span className="text-xs text-gray-400">· {openHint}</span>}
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl flex-shrink-0">🏠</div>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un plat…"
              className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 outline-none"
              style={{ fontSize: '16px' }} />
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full transition-all flex-shrink-0 ${
                activeCat === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Liste plats */}
      <div className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-medium text-gray-700">Aucun plat trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <DishCard
                key={item._id}
                item={item}
                qty={Object.values(cart).filter(c => c.id === item._id).reduce((s, c) => s + c.qty, 0)}
                onOpen={setDetail}
                onAddDirect={(item) => addToCart(item, 1, null, [])}
                onRemoveDirect={(item) => removeFromCart({ ...item, cartKey: item._id || item.id })}
              />
            ))}
          </div>
        )}
        <div style={{ height: cartCount > 0 ? '80px' : '16px' }} />
      </div>

      {/* Barre panier */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-2"
             style={{ maxWidth: '480px', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <button onClick={() => setShowCart(true)}
            className="w-full text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-between px-5 shadow-lg active:scale-[0.98] transition-all"
            style={{ background: '#075E54' }}>
            <div className="bg-white/20 rounded-lg px-2 py-1 text-xs font-bold">{cartCount}</div>
            <span>Voir mon panier</span>
            <span>{formatFCFA(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* Fiche détail */}
      {detail && (
        <ItemDetail
          item={detail}
          onClose={() => setDetail(null)}
          onAdd={(item, qty, unitPrice, options) => {
            addToCart(item, qty, unitPrice, options)
            setDetail(null)
          }}
        />
      )}
    </div>
  )
}
