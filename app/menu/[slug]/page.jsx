'use client'
import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  ShoppingCart, Search, Star, Clock, ChevronLeft,
  Plus, Minus, Trash2, ArrowRight, Loader2, MapPin
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

function formatFCFA(n) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'
}

// ── Skeleton loading ─────────────────────────────────────────────
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  )
}

// ── Carte plat ───────────────────────────────────────────────────
function DishCard({ item, qty, onAdd, onRemove }) {
  const [imgError, setImgError] = useState(false)
  const [adding,   setAdding]   = useState(false)

  const handleAdd = () => {
    setAdding(true)
    onAdd(item)
    setTimeout(() => setAdding(false), 400)
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '140px' }}>
        {!imgError && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100
                          flex items-center justify-center text-5xl">
            🍽️
          </div>
        )}
        {/* Badge préparation */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white
                        text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Clock size={10} />
          {item.preparationTime} min
        </div>
        {/* Badge quantité dans panier */}
        {qty > 0 && (
          <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold
                          w-6 h-6 rounded-full flex items-center justify-center">
            {qty}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col flex-1 p-3">
        <p className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed flex-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm font-bold text-gray-900">{formatFCFA(item.price)}</p>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                         ${adding ? 'bg-green-500 scale-90' : 'bg-gray-900 active:scale-90'}`}
            >
              <Plus size={16} className="text-white" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemove(item)}
                className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center
                           justify-center active:scale-90 transition-all"
              >
                <Minus size={12} className="text-gray-600" />
              </button>
              <span className="text-sm font-bold text-gray-900 w-4 text-center">{qty}</span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center
                           active:scale-90 transition-all"
              >
                <Plus size={12} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Vue panier ────────────────────────────────────────────────────
function CartView({ cart, restaurant, onBack, onAdd, onRemove, onClear }) {
  const items    = Object.values(cart).filter(i => i.qty > 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  const [ordering, setOrdering] = React.useState(false)
  const [orderError, setOrderError] = React.useState('')

  const handleOrder = async () => {
    setOrdering(true)
    setOrderError('')
    try {
      // Crée la commande temporaire en base
      const payload = {
        slug,
        items: items.map(i => ({ menuItemId: i.id, quantity: i.qty }))
      }
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'}/api/public/order/create`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) {
        setOrderError(data.message || 'Erreur lors de la création de la commande.')
        return
      }

      // Envoie uniquement le token sur WhatsApp
      const phone = restaurant.phone?.replace(/\D/g, '') || ''
      const url   = `https://wa.me/${phone}?text=${encodeURIComponent(data.token)}`
      window.open(url, '_blank')

    } catch (err) {
      setOrderError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setOrdering(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Mon panier</h2>
          <p className="text-xs text-gray-400">{items.length} article{items.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Articles */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-sm font-medium text-gray-700">Panier vide</p>
            <p className="text-xs text-gray-400 mt-1">Ajoutez des plats pour commander</p>
            <button onClick={onBack} className="mt-4 text-sm font-medium text-gray-900
                                               border border-gray-200 px-4 py-2 rounded-xl">
              Voir le menu
            </button>
          </div>
        ) : items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-3
                                        border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatFCFA(item.price)} / unité</p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {formatFCFA(item.price * item.qty)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onRemove(item)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center
                           justify-center active:scale-90 transition-all"
              >
                {item.qty === 1 ? <Trash2 size={13} className="text-red-400" /> : <Minus size={13} className="text-gray-600" />}
              </button>
              <span className="text-sm font-bold text-gray-900 w-5 text-center">{item.qty}</span>
              <button
                onClick={() => onAdd(item)}
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center
                           active:scale-90 transition-all"
              >
                <Plus size={13} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Résumé + bouton commande */}
      {items.length > 0 && (
        <div className="bg-white border-t border-gray-100 px-4 pt-4 pb-6 flex-shrink-0">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-medium text-gray-900">{formatFCFA(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <MapPin size={12} /> Livraison
              </span>
              <span className="text-gray-400">Calculée à la commande</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900
                            border-t border-gray-100 pt-3 mt-2">
              <span>Total estimé</span>
              <span>{formatFCFA(subtotal)}</span>
            </div>
          </div>

          {orderError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-red-600 text-center">{orderError}</p>
            </div>
          )}

          <button
            onClick={handleOrder}
            disabled={ordering}
            className="w-full py-4 rounded-2xl text-white font-bold text-base
                       flex items-center justify-center gap-3 active:scale-[0.98] transition-all
                       disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: '#075E54' }}
          >
            {ordering ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Préparation de la commande…
              </>
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
            Vous serez redirigé vers WhatsApp pour finaliser la livraison et payer via Wave
          </p>
        </div>
      )}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────
export default function MenuPage() {
  const { slug }                        = useParams()
  const [restaurant, setRestaurant]     = useState(null)
  const [menuItems,  setMenuItems]      = useState([])
  const [loading,    setLoading]        = useState(true)
  const [error,      setError]          = useState(null)
  const [cart,       setCart]           = useState({})
  const [search,     setSearch]         = useState('')
  const [activecat,  setActiveCat]      = useState('Tous')
  const [showCart,   setShowCart]       = useState(false)

  // Charge le restaurant + menu depuis l'API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/menu/${slug}`)
        if (!res.ok) throw new Error('Restaurant introuvable')
        const data = await res.json()
        setRestaurant(data.restaurant)
        setMenuItems(data.items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  // Panier persistant en sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`skanema_cart_${slug}`)
    if (saved) {
      try { setCart(JSON.parse(saved)) } catch (_) {}
    }
  }, [slug])

  useEffect(() => {
    sessionStorage.setItem(`skanema_cart_${slug}`, JSON.stringify(cart))
  }, [cart, slug])

  const addToCart = useCallback((item) => {
  const key = item._id || item.id
  setCart(prev => ({
    ...prev,
    [key]: {
      id      : key,
      name    : item.name,
      price   : item.price,
      imageUrl: item.imageUrl,
      qty     : (prev[key]?.qty || 0) + 1,
    }
  }))
}, [])

const removeFromCart = useCallback((item) => {
  const key = item._id || item.id
  setCart(prev => {
    const current = prev[key]?.qty || 0
    if (current <= 1) {
      const next = { ...prev }
      delete next[key]
      return next
    }
    return { ...prev, [key]: { ...prev[key], qty: current - 1 } }
  })
}, [])

  const cartCount = Object.values(cart).reduce((s, i) => s + i.qty, 0)
  const cartTotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0)

  // Catégories uniques
  const categories = ['Tous', ...new Set(menuItems.map(i => i.category).filter(Boolean))]

  // Filtrage
  const filtered = menuItems.filter(item => {
    const matchCat    = activecat === 'Tous' || item.category === activecat
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch && item.available
  })

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-4 py-5 border-b border-gray-100">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden">
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-1/2" />
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
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <CartView
        cart={cart}
        restaurant={restaurant}
        onBack={() => setShowCart(false)}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={() => setCart({})}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ maxWidth: '480px', margin: '0 auto' }}>

      {/* Header restaurant */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-gray-900">{restaurant?.name}</h1>
                <span className="text-xs bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full">
                  Ouvert
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{restaurant?.address || 'Dakar, Sénégal'}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" /> 4.8 (127 avis)
                </span>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={11} /> 30 – 45 min
                </span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center
                            text-3xl flex-shrink-0">
              🏠
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un plat…"
              className="w-full bg-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700
                         outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Catégories */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full
                         transition-all flex-shrink-0 ${
                activecat === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille plats */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-medium text-gray-700">Aucun plat trouvé</p>
            <p className="text-xs text-gray-400 mt-1">Essayez une autre recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(item => (
              <DishCard
                key={item._id}
                item={item}
                qty={cart[item._id || item.id]?.qty || 0}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        )}
        <div style={{ height: cartCount > 0 ? '80px' : '16px' }} />
      </div>

      {/* Barre panier flottante */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-2"
             style={{ maxWidth: '480px', margin: '0 auto', left: '50%', transform: 'translateX(-50%)', right: 'auto', width: '100%' }}>
          <button
            onClick={() => setShowCart(true)}
            className="w-full text-white py-4 rounded-2xl font-bold text-sm
                       flex items-center justify-between px-5 shadow-lg active:scale-[0.98] transition-all"
            style={{ background: '#075E54' }}
          >
            <div className="bg-white/20 rounded-lg px-2 py-1 text-xs font-bold">
              {cartCount}
            </div>
            <span>Voir mon panier</span>
            <span className="font-bold">{formatFCFA(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
