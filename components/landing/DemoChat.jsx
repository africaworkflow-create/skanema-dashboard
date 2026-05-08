'use client'
import { useState, useEffect, useRef } from 'react'
import { MapPin, Send, RotateCcw, MessageCircle } from 'lucide-react'

const MENU = [
  {
    id:'1', name:'Thiéboudienne Rouge', price:3500,
    desc:'Le plat national sénégalais — riz cuit dans une sauce tomate avec du poisson frais et des légumes.',
    img:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80',
    prepTime:45,
  },
  {
    id:'2', name:'Mafé au Bœuf', price:4000,
    desc:'Ragout de bœuf mijoté en sauce d\'arachide crémeuse, servi avec du riz blanc parfumé.',
    img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
    prepTime:50,
  },
  {
    id:'3', name:'Yassa Poulet', price:3800,
    desc:'Poulet mariné à l\'oignon et au citron, grillé puis mijoté. Incontournable wolof.',
    img:'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80',
    prepTime:40,
  },
  {
    id:'4', name:'Jus de Bissap', price:800,
    desc:'Boisson naturelle aux fleurs d\'hibiscus séchées, légèrement sucrée et rafraîchissante.',
    img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
    prepTime:5,
  },
]

const ZONES = [
  { name:'Zone A', fee:1000 },
  { name:'Zone B', fee:2000 },
  { name:'Zone C', fee:3000 },
]

const fmt = (n) => n.toLocaleString('fr-FR') + ' FCFA'

// ── Carousel swipeable avec vraies photos ────────────────────────
function MenuCarousel({ onAdd }) {
  const [idx,    setIdx]    = useState(0)
  const [added,  setAdded]  = useState(null)
  const [startX, setStartX] = useState(null)
  const [dx,     setDx]     = useState(0)
  const [anim,   setAnim]   = useState(true)
  const item = MENU[idx]

  // Empêche le scroll de la page pendant le swipe
  const stopProp = (e) => e.stopPropagation()

  const goTo = (i) => {
    setAnim(true)
    setIdx(Math.max(0, Math.min(MENU.length - 1, i)))
    setDx(0)
  }

  const onTouchStart = (e) => {
    e.stopPropagation()
    setStartX(e.touches[0].clientX)
    setAnim(false)
    setDx(0)
  }

  const onTouchMove = (e) => {
    e.stopPropagation()
    // Ne pas appeler preventDefault ici (passive listeners)
    if (startX === null) return
    setDx(e.touches[0].clientX - startX)
  }

  const onTouchEnd = (e) => {
    e.stopPropagation()
    setAnim(true)
    if (dx < -40)     goTo(idx + 1)
    else if (dx > 40) goTo(idx - 1)
    else              setDx(0)
    setStartX(null)
  }

  const onMouseDown  = (e) => { e.stopPropagation(); setStartX(e.clientX); setAnim(false) }
  const onMouseMove  = (e) => { e.stopPropagation(); if (startX === null) return; setDx(e.clientX - startX) }
  const onMouseUp    = (e) => {
    e.stopPropagation()
    setAnim(true)
    if (dx < -40)     goTo(idx + 1)
    else if (dx > 40) goTo(idx - 1)
    else              setDx(0)
    setStartX(null)
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    onAdd(item)
    setAdded(item.id)
    setTimeout(() => setAdded(null), 1200)
  }

  return (
    <div onClick={stopProp} onMouseDown={stopProp} className="select-none w-full">

      {/* Carte swipeable */}
      <div
        className="rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ touchAction:'pan-y' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div style={{
          transform: `translateX(${dx * 0.25}px)`,
          transition: anim ? 'transform 0.2s ease' : 'none',
        }}>
          {/* Photo */}
          <div className="relative overflow-hidden" style={{ height:'130px' }}>
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
              onError={e => { e.target.style.display='none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
              <p className="text-white font-semibold text-sm drop-shadow">{item.name}</p>
              <p className="text-white font-bold text-xs bg-black/40 px-2 py-0.5 rounded-full">
                {fmt(item.price)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white px-3 py-2">
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            <p className="text-2xs text-gray-300 mt-1">⏱️ ~{item.prepTime} min</p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 my-2.5">
        {MENU.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); goTo(i) }}
            className="rounded-full transition-all duration-300"
            style={{
              width : i === idx ? '20px' : '6px',
              height: '6px',
              background: i === idx ? '#075E54' : '#D1D5DB',
            }}
          />
        ))}
      </div>

      <p className="text-center text-gray-300 mb-2" style={{ fontSize:'9px' }}>
        ← Glissez pour naviguer →
      </p>

      {/* Bouton ajouter */}
      <button
        onClick={handleAdd}
        className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 active:scale-95"
        style={{ background: added === item.id ? '#16a34a' : '#075E54' }}
      >
        {added === item.id ? '✅ Ajouté au panier !' : `🛒 Ajouter — ${fmt(item.price)}`}
      </button>
    </div>
  )
}

// ── Message individuel ────────────────────────────────────────────
function Message({ msg, onAction }) {
  const isClient = msg.from === 'client'

  const handleClick = (e, action, payload) => {
    e.stopPropagation()
    onAction(action, payload)
  }

  return (
    <div
      className={`flex ${isClient ? 'justify-end' : 'justify-start'} mb-2`}
      onClick={e => e.stopPropagation()}
    >
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
        isClient ? 'bg-[#DCF8C6] text-gray-800 rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm'
      }`}>

        {msg.text && <p className="whitespace-pre-line mb-1">{msg.text}</p>}

        {msg.type === 'carousel' && (
          <div className="mt-1 w-52">
            <MenuCarousel onAdd={(item) => onAction('ADD_ITEM', item)} />
          </div>
        )}

        {msg.type === 'cart_summary' && (
          <div className="mt-1">
            {msg.items.map((i, j) => (
              <div key={j} className="flex justify-between py-0.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-600 truncate max-w-[120px]">{i.name} ×{i.quantity}</span>
                <span className="font-medium ml-2">{fmt(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="mt-2 pt-1 space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span><span>{fmt(msg.subtotal)}</span>
              </div>
              {msg.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Livraison ({msg.zone})</span><span>{fmt(msg.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>TOTAL</span><span>{fmt(msg.total)}</span>
              </div>
            </div>
          </div>
        )}

        {msg.type === 'location_request' && (
          <button
            onClick={(e) => handleClick(e, 'SEND_LOCATION')}
            className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl
                       flex items-center justify-center gap-1.5 transition-colors font-medium"
          >
            <MapPin size={12} /> Partager ma position GPS
          </button>
        )}

        {msg.type === 'payment_link' && (
          <button
            onClick={(e) => handleClick(e, 'PAY_NOW')}
            className="mt-2 w-full text-white py-2.5 rounded-xl flex items-center justify-center
                       gap-1.5 font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background:'#1DB954' }}
          >
            🌊 Payer {fmt(msg.total)} via Wave
          </button>
        )}

        {msg.type === 'receipt' && (
          <div className="mt-1 bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🎉</div>
            <p className="text-green-700 font-bold text-sm">Paiement confirmé !</p>
            <p className="text-green-500 text-xs mt-0.5">Livraison estimée ~40 min 🛵</p>
            <p className="text-gray-400 text-2xs mt-1">Reçu PDF envoyé sur WhatsApp</p>
          </div>
        )}

        {msg.buttons?.length > 0 && (
          <div className="mt-2 space-y-1">
            {msg.buttons.map((btn, i) => (
              <button
                key={i}
                onClick={(e) => handleClick(e, btn.action, btn.payload)}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200
                           text-gray-700 py-2 rounded-xl transition-colors font-medium text-center"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        <p className="text-right text-2xs text-gray-400 mt-1">
          {new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
        </p>
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────
export function DemoChat() {
  const [messages, setMessages] = useState([])
  const [typing,   setTyping]   = useState(false)
  const [input,    setInput]    = useState('')
  const [started,  setStarted]  = useState(false)
  const [cart,     setCart]     = useState([])
  const endRef   = useRef(null)
  const phoneRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' })
  }, [messages, typing])

  function addMsg(msg) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }])
  }

  function botReply(msgs, delay = 700) {
    setTyping(true)
    let offset = delay
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        setTyping(false)
        addMsg({ from:'bot', ...msg })
        if (i < msgs.length - 1) setTyping(true)
      }, offset)
      offset += 800 + (msg.text?.length || 0) * 6
    })
  }

  const getTotal = (c) => c.reduce((s, i) => s + i.price * i.quantity, 0)

  function startDemo() {
    setStarted(true); setCart([]); setMessages([])
    botReply([{
      text   : `👋 Bienvenue chez *Chez Fatou* !\n\nDécouvrez nos ${MENU.length} plats du jour 🍽️`,
      buttons: [
        { label:'🍽️ Voir le menu', action:'SHOW_MENU' },
        { label:'🛒 Mon panier',   action:'VIEW_CART'  },
      ]
    }], 300)
  }

  function handleAction(action, payload) {
    switch(action) {

      case 'SHOW_MENU':
        addMsg({ from:'client', text:'🍽️ Voir le menu' })
        botReply([{
          type: 'carousel',
          text: 'Voici notre carte 👇\nGlissez pour voir tous les plats :',
        }])
        break

      case 'ADD_ITEM': {
        const item = payload
        const newCart = cart.find(i => i.id === item.id)
          ? cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...cart, { ...item, quantity: 1 }]
        setCart(newCart)
        const count = newCart.reduce((s, i) => s + i.quantity, 0)
        botReply([{
          text   : `✅ *${item.name}* ajouté !\n🛒 ${count} article${count>1?'s':''} — ${fmt(getTotal(newCart))}`,
          buttons: [
            { label:'✅ Commander',  action:'CONFIRM_CART' },
            { label:'🛒 Mon panier', action:'VIEW_CART'    },
          ]
        }])
        break
      }

      case 'VIEW_CART': {
        addMsg({ from:'client', text:'🛒 Mon panier' })
        if (!cart.length) {
          botReply([{ text:'🛒 Panier vide.', buttons:[{ label:'🍽️ Voir le menu', action:'SHOW_MENU' }] }])
          return
        }
        const sub = getTotal(cart)
        botReply([{
          type:'cart_summary', items:cart, subtotal:sub, deliveryFee:0, total:sub,
          buttons:[
            { label:'✅ Commander',       action:'CONFIRM_CART' },
            { label:'➕ Continuer',       action:'SHOW_MENU'    },
            { label:'🗑️ Vider',          action:'CLEAR_CART'   },
          ]
        }])
        break
      }

      case 'CONFIRM_CART':
        if (!cart.length) { handleAction('SHOW_MENU'); return }
        addMsg({ from:'client', text:'✅ Commander' })
        botReply([{ type:'location_request', text:'📍 *Où souhaitez-vous être livré ?*\n\nPartagez votre position GPS pour calculer les frais de livraison.' }])
        break

      case 'CLEAR_CART':
        addMsg({ from:'client', text:'🗑️ Vider' })
        setCart([])
        botReply([{ text:'🗑️ Panier vidé.', buttons:[{ label:'🍽️ Voir le menu', action:'SHOW_MENU' }] }])
        break

      case 'SEND_LOCATION': {
        addMsg({ from:'client', text:'📍 Plateau, Dakar — Position partagée' })
        const zone = ZONES[0]
        const sub  = getTotal(cart)
        const tot  = sub + zone.fee
        botReply([
          { text:`📍 *${zone.name}* — 1.2 km du restaurant\n🚴 Frais de livraison : ${fmt(zone.fee)}` },
          {
            type:'cart_summary', items:cart, subtotal:sub,
            deliveryFee:zone.fee, zone:zone.name, total:tot,
            buttons:[{ label:'💳 Payer via Wave', action:'INITIATE_PAYMENT' }]
          }
        ])
        break
      }

      case 'INITIATE_PAYMENT': {
        addMsg({ from:'client', text:'💳 Payer via Wave' })
        const total = getTotal(cart) + ZONES[0].fee
        botReply([{
          type :'payment_link',
          text : `💳 *Commande ${fmt(total)}*\n\n🔒 Paiement sécurisé Wave\n⚠️ Lien valable 15 minutes.`,
          total,
        }])
        break
      }

      case 'PAY_NOW':
        addMsg({ from:'client', text:'✅ Paiement effectué' })
        botReply([
          { text:'✅ *Paiement Wave confirmé !*\n\n🎉 Merci pour votre commande !\n📋 CMD-20260507-0001' },
          { type:'receipt', buttons:[{ label:'🔄 Nouvelle commande', action:'RESTART' }] }
        ])
        break

      case 'RESTART':
        setMessages([]); setCart([]); setStarted(false)
        setTimeout(startDemo, 400)
        break

      default: break
    }
  }

  function handleSend(e) {
    e?.stopPropagation()
    const text = input.trim(); if (!text) return
    setInput(''); addMsg({ from:'client', text })
    const lower = text.toLowerCase()
    if (['menu','bonjour','salut','hello','start'].some(k => lower.includes(k)))
      setTimeout(() => handleAction('SHOW_MENU'), 400)
    else if (['panier','cart'].some(k => lower.includes(k)))
      setTimeout(() => handleAction('VIEW_CART'), 400)
    else
      botReply([{ text:'Tapez *menu* pour voir nos plats 🍽️', buttons:[{ label:'🍽️ Voir le menu', action:'SHOW_MENU' }] }])
  }

  return (
    <div className="flex flex-col items-center" onClick={e => e.stopPropagation()}>

      {/* ── iPhone 16 Pro ── */}
      <div
        ref={phoneRef}
        className="relative"
        style={{ width:'280px' }}
        onClick={e => e.stopPropagation()}
        onScroll={e => e.stopPropagation()}
      >
        {/* Corps titane */}
        <div
          className="relative rounded-[3rem] overflow-hidden shadow-2xl"
          style={{ background:'linear-gradient(145deg,#8B7355 0%,#6B5744 40%,#8B7355 100%)', padding:'2.5px' }}
        >
          <div className="rounded-[2.85rem] overflow-hidden bg-black flex flex-col" style={{ height:'600px' }}>

            {/* Dynamic Island + Header WA */}
            <div className="relative flex-shrink-0" style={{ background:'#075E54' }}>
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20"
                   style={{ width:'96px', height:'26px', background:'#000', borderRadius:'20px' }} />
              <div className="flex items-center justify-between px-4 pb-2.5" style={{ paddingTop:'38px' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center
                                  text-xs font-bold text-orange-700 border-2 border-white/20">CF</div>
                  <div>
                    <p className="text-white text-xs font-semibold">Chez Fatou 🍽️</p>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-green-200 text-2xs">en ligne</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setMessages([]); setCart([]); setStarted(false) }}
                  className="text-green-200 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                  title="Recommencer"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Zone messages — scroll interne SEULEMENT */}
            <div
              className="flex-1 overflow-y-auto bg-[#ECE5DD] px-3 py-3 overscroll-contain"
              style={{ scrollbarWidth:'none', msOverflowStyle:'none' }}
              onClick={e => e.stopPropagation()}
              onWheel={e => e.stopPropagation()}
            >
              {!started ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                    <img src={MENU[0].img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Testez le bot en direct</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Commandez, géolocalisez-vous<br />et payez via Wave en live.
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); startDemo() }}
                    className="text-white text-xs font-semibold px-5 py-2.5 rounded-full
                               flex items-center gap-2 transition-all hover:opacity-90 active:scale-95"
                    style={{ background:'#075E54' }}
                  >
                    <MessageCircle size={13} /> Démarrer la démo
                  </button>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <Message key={msg.id} msg={msg} onAction={handleAction} />
                  ))}
                  {typing && (
                    <div className="flex justify-start mb-2">
                      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
                        {[0,1,2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay:`${i*0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </>
              )}
            </div>

            {/* Input */}
            {started && (
              <div
                className="flex-shrink-0 flex items-center gap-2 px-2.5 py-2"
                style={{ background:'#F0F0F0' }}
                onClick={e => e.stopPropagation()}
              >
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); handleSend() } }}
                  onClick={e => e.stopPropagation()}
                  placeholder='Tapez "menu"…'
                  className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-gray-700
                             outline-none border border-gray-200 focus:border-gray-300 min-w-0"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleSend(e) }}
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background:'#075E54' }}
                >
                  <Send size={12} className="text-white" />
                </button>
              </div>
            )}

            {/* Home indicator */}
            <div className="flex-shrink-0 flex justify-center py-1.5" style={{ background: started ? '#F0F0F0' : '#ECE5DD' }}>
              <div className="w-24 h-1 bg-gray-400/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Boutons physiques */}
        <div className="absolute right-0 top-28 rounded-l-sm" style={{ width:'3px', height:'32px', background:'#6B5744', transform:'translateX(3px)' }} />
        <div className="absolute right-0 top-44 rounded-l-sm" style={{ width:'3px', height:'32px', background:'#6B5744', transform:'translateX(3px)' }} />
        <div className="absolute left-0 top-36 rounded-r-sm"  style={{ width:'3px', height:'48px', background:'#6B5744', transform:'translateX(-3px)' }} />
        <div className="absolute left-0 top-24 rounded-r-sm"  style={{ width:'3px', height:'20px', background:'#6B5744', transform:'translateX(-3px)' }} />
      </div>

      <p className="text-center text-xs text-gray-400 mt-5">
        Simulation fidèle du vrai bot · Glissez les cartes pour naviguer
      </p>
    </div>
  )
}
