'use client'
import { DemoChat } from './DemoChat'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageCircle, Zap, BarChart3, MapPin, CreditCard,
  CheckCircle2, ArrowRight, Menu, X, Star,
  ShoppingBag, Clock, Users, TrendingUp, ChevronRight
} from 'lucide-react'

// ── Nav ───────────────────────────────────────────────────────────
function Nav() {
  const [open,       setOpen]       = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Fonctionnalités', href: '#features'  },
    { label: 'Tarifs',          href: '#pricing'    },
    { label: 'FAQ',             href: '#faq'        },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-white/95 backdrop-blur border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight text-gray-900">Skanema</div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
               className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="https://dashboard.skanema.com/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
            Connexion
          </Link>
          <Link href="https://dashboard.skanema.com/onboarding"
                className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg
                           hover:bg-gray-800 transition-colors">
            Démarrer gratuitement
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
               className="block py-2.5 text-sm text-gray-600 hover:text-gray-900">
              {l.label}
            </a>
          ))}
          <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
            <Link href="https://dashboard.skanema.com/login"
                  className="block text-center py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg">
              Connexion
            </Link>
            <Link href="https://dashboard.skanema.com/onboarding"
                  className="block text-center py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg">
              Démarrer gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-32 pb-20 px-5 sm:px-8 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium
                        px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Essai gratuit 14 jours — sans carte bancaire
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight tracking-tight mb-6">
          Votre restaurant prend des{' '}
          <span className="relative">
            <span className="relative z-10">commandes</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-yellow-200 -z-0 -rotate-1" />
          </span>
          {' '}sur WhatsApp
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
          Bot WhatsApp intelligent pour les restaurants et commerces. Menu interactif,
          paiement Wave intégré, livraison géolocalisée. Prêt en 10 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="https://dashboard.skanema.com/onboarding"
                className="w-full sm:w-auto bg-gray-900 text-white font-medium px-6 py-3 rounded-xl
                           hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Démarrer gratuitement <ArrowRight size={16} />
          </Link>
          <a href="#demo"
             className="w-full sm:w-auto border border-gray-200 text-gray-700 font-medium px-6 py-3
                        rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <MessageCircle size={16} className="text-green-500" />
            Voir la démo
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Déjà utilisé par <strong className="text-gray-600">+50 restaurants</strong> en Afrique de l'Ouest
        </p>
      </div>

      {/* Dashboard preview */}
      <div className="max-w-5xl mx-auto mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10 pointer-events-none" />
        <div className="bg-gray-900 rounded-2xl p-1.5 shadow-2xl">
          <div className="bg-white rounded-xl overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 ml-2">
                dashboard.skanema.com
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="grid grid-cols-4 min-h-[320px]">
              {/* Sidebar */}
              <div className="col-span-1 border-r border-gray-100 p-4 hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 mb-1">Skanema</div>
                <div className="text-xs text-gray-400 mb-4">Chez Fatou</div>
                {['Vue d\'ensemble','Commandes','Menu','Statistiques'].map((item, i) => (
                  <div key={i} className={`text-xs px-3 py-2 rounded-lg mb-0.5 ${
                    i === 0 ? 'bg-gray-900 text-white' : 'text-gray-500'
                  }`}>{item}</div>
                ))}
              </div>
              {/* Content */}
              <div className="col-span-4 sm:col-span-3 p-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    { label:'Commandes aujourd\'hui', value:'24' },
                    { label:'Chiffre d\'affaires',    value:'87 400 F' },
                    { label:'Panier moyen',           value:'3 642 F' },
                    { label:'Clients actifs',         value:'148' },
                  ].map((m, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-2xs text-gray-400 mb-1">{m.label}</p>
                      <p className="text-base font-semibold text-gray-900">{m.value}</p>
                    </div>
                  ))}
                </div>
                {/* Mini chart */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-700 mb-3">CA cette semaine</p>
                  <div className="flex items-end gap-1.5 h-16">
                    {[35,55,40,70,50,85,100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm"
                           style={{ height: `${h}%`, background: i === 6 ? '#111827' : '#e5e7eb' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Logos clients ─────────────────────────────────────────────────
function SocialProof() {
  const stats = [
    { value: '50+',    label: 'Restaurants actifs'   },
    { value: '2 400+', label: 'Commandes traitées'   },
    { value: '99.9%',  label: 'Disponibilité du bot' },
    { value: '4.9/5',  label: 'Note moyenne'         },
  ]
  return (
    <section className="py-12 border-y border-gray-100 bg-gray-50">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WhatsApp Demo ─────────────────────────────────────────────────
function Demo() {
  return (
    <section id='demo' className='py-20 px-5 sm:px-8 bg-white'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div>
            <div className='text-xs font-medium text-gray-400 uppercase tracking-wider mb-3'>Démo interactive</div>
            <h2 className='text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-5'>
              Testez le bot en temps réel
            </h2>
            <p className='text-gray-500 leading-relaxed mb-8'>
              Le simulateur ci-contre fonctionne exactement comme le vrai bot WhatsApp de vos clients.
              Naviguez dans le menu, ajoutez des plats, partagez une position et simulez un paiement Wave.
            </p>
            <div className='space-y-4'>
              {[
                { icon: MessageCircle, title: 'Menu interactif avec photos', desc: 'Navigation plat par plat avec description et prix' },
                { icon: MapPin,        title: 'Géolocalisation automatique',  desc: 'Calcul des frais de livraison selon la position GPS' },
                { icon: CreditCard,    title: 'Paiement Wave en un clic',     desc: 'Lien de paiement sécurisé généré automatiquement' },
                { icon: CheckCircle2,  title: 'Reçu PDF instantané',          desc: 'Envoyé automatiquement dès confirmation du paiement' },
              ].map((f, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <f.icon size={15} className='text-gray-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{f.title}</p>
                    <p className='text-xs text-gray-400 mt-0.5'>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DemoChat />
        </div>
      </div>
    </section>
  )
}

function _OldDemo() {
  const messages = [
    { from: 'client',  text: 'menu',                             time: '12:00' },
    { from: 'bot',     text: '🏠 Bienvenue chez Chez Fatou !\n\nDécouvrez nos 7 plats du jour 🍽️', time: '12:00', hasButtons: true },
    { from: 'bot',     text: '🍽️ Thiéboudienne Rouge\n💰 3 500 FCFA\n\nLe plat national sénégalais…\n\n●○○○○○○  1/7', time: '12:00', isCard: true },
    { from: 'client',  text: '🛒 Ajouter',                       time: '12:01' },
    { from: 'bot',     text: '✅ Thiéboudienne ajoutée !\n\n🛒 1 article — 3 500 FCFA',             time: '12:01' },
    { from: 'client',  text: '✅ Commander',                      time: '12:02' },
    { from: 'bot',     text: '📍 Partagez votre position GPS pour calculer les frais de livraison.', time: '12:02', isLocation: true },
    { from: 'client',  text: '📍 Position partagée',             time: '12:02', isPin: true },
    { from: 'bot',     text: '📍 Zone A — 1.2 km\n🚴 Livraison : 1 000 FCFA\n💰 TOTAL : 4 500 FCFA', time: '12:03', hasPayBtn: true },
  ]

  return (
    <section id="demo" className="py-20 px-5 sm:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Démo en direct</div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-5">
              Une expérience client fluide et moderne
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Du menu à la confirmation de paiement, tout se passe dans WhatsApp.
              Pas d'app à télécharger, pas de compte à créer pour le client.
              Juste un numéro WhatsApp et c'est parti.
            </p>
            <div className="space-y-4">
              {[
                { icon: MessageCircle, title: 'Menu interactif',     desc: 'Photos, prix et descriptions de chaque plat' },
                { icon: MapPin,        title: 'Localisation GPS',     desc: 'Calcul automatique des frais de livraison' },
                { icon: CreditCard,    title: 'Paiement Wave',        desc: 'Lien de paiement sécurisé en un clic' },
                { icon: CheckCircle2,  title: 'Reçu automatique',     desc: 'PDF envoyé instantanément après confirmation' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon size={15} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{f.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="w-72 bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
              <div className="bg-white rounded-[2rem] overflow-hidden">
                {/* WA header */}
                <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">CF</div>
                  <div>
                    <p className="text-white text-xs font-medium">Chez Fatou 🍽️</p>
                    <p className="text-green-200 text-2xs">en ligne</p>
                  </div>
                </div>
                {/* Messages */}
                <div className="bg-[#ECE5DD] p-3 space-y-2 min-h-[400px] overflow-hidden">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.from === 'client'
                          ? 'bg-[#DCF8C6] text-gray-800 rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.isPin ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-red-500" />
                            <span>Position partagée</span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-line">{msg.text}</p>
                        )}
                        {msg.isCard && (
                          <div className="mt-2 grid grid-cols-3 gap-1">
                            <button className="col-span-1 bg-gray-100 text-gray-600 text-2xs py-1 rounded text-center">◀️</button>
                            <button className="col-span-1 bg-gray-900 text-white text-2xs py-1 rounded text-center">🛒</button>
                            <button className="col-span-1 bg-gray-100 text-gray-600 text-2xs py-1 rounded text-center">▶️</button>
                          </div>
                        )}
                        {msg.hasButtons && (
                          <div className="mt-2 space-y-1">
                            <button className="w-full bg-gray-100 text-gray-700 text-2xs py-1.5 rounded text-center">🍽️ Voir le menu</button>
                            <button className="w-full bg-gray-100 text-gray-700 text-2xs py-1.5 rounded text-center">🛒 Mon panier</button>
                          </div>
                        )}
                        {msg.hasPayBtn && (
                          <button className="mt-2 w-full bg-[#075E54] text-white text-2xs py-1.5 rounded text-center">
                            💳 Payer via Wave
                          </button>
                        )}
                        {msg.isLocation && (
                          <button className="mt-2 w-full bg-gray-100 text-gray-700 text-2xs py-1.5 rounded flex items-center justify-center gap-1">
                            <MapPin size={10} /> Partager ma position
                          </button>
                        )}
                        <p className="text-right text-2xs text-gray-400 mt-0.5">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon : Zap,
      title: 'Mise en place en 10 minutes',
      desc : 'Connectez votre numéro WhatsApp Business, ajoutez vos plats avec photos, et votre bot est prêt à prendre des commandes.',
    },
    {
      icon : BarChart3,
      title: 'Dashboard en temps réel',
      desc : 'Suivez vos commandes, votre chiffre d\'affaires et vos plats les plus populaires depuis une interface épurée.',
    },
    {
      icon : MapPin,
      title: 'Livraison géolocalisée',
      desc : 'Le bot calcule automatiquement la distance et les frais de livraison selon la position GPS du client.',
    },
    {
      icon : CreditCard,
      title: 'Paiement Wave intégré',
      desc : 'Générez un lien de paiement Wave en un clic. Confirmation automatique dès que le client paie.',
    },
    {
      icon : ShoppingBag,
      title: 'Panier multi-plats',
      desc : 'Les clients peuvent commander plusieurs plats à la fois. Le bot gère tout le flux de commande.',
    },
    {
      icon : Clock,
      title: 'Notifications restaurant',
      desc : 'Vous recevez une alerte WhatsApp pour chaque nouvelle commande. Acceptez ou refusez en un tap.',
    },
  ]

  return (
    <section id="features" className="py-20 px-5 sm:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Fonctionnalités</div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
            Tout ce dont votre restaurant a besoin
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name    : 'Basic',
      price   : '15 000',
      desc    : 'Pour démarrer',
      features: ['10 plats au menu','Bot WhatsApp complet','Paiement Wave','Dashboard admin','Reçu PDF automatique','1 zone de livraison'],
      cta     : 'Commencer — gratuit 14j',
      popular : false,
    },
    {
      name    : 'Pro',
      price   : '35 000',
      desc    : 'Le plus populaire',
      features: ['25 plats au menu','Bot WhatsApp complet','Paiement Wave','Dashboard admin complet','Statistiques avancées','3 zones de livraison','Reçu PDF + email'],
      cta     : 'Commencer — gratuit 14j',
      popular : true,
    },
    {
      name    : 'Premium',
      price   : '75 000',
      desc    : 'Pour les grands restaurants',
      features: ['Plats illimités','Bot WhatsApp complet','Paiement Wave','Dashboard admin complet','Statistiques + exports','Zones illimitées','Support prioritaire WhatsApp','Onboarding personnalisé'],
      cta     : 'Commencer — gratuit 14j',
      popular : false,
    },
  ]

  return (
    <section id="pricing" className="py-20 px-5 sm:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Tarifs</div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
            Simple et transparent
          </h2>
          <p className="text-gray-400 text-sm">14 jours d'essai gratuit sur tous les plans. Sans carte bancaire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-2xl p-6 flex flex-col ${
              plan.popular
                ? 'bg-gray-900 text-white ring-2 ring-gray-900 scale-[1.02]'
                : 'bg-white border border-gray-100'
            }`}>
              {plan.popular && (
                <div className="text-xs font-medium bg-white text-gray-900 px-3 py-1 rounded-full w-fit mb-4">
                  ⭐ Le plus populaire
                </div>
              )}
              <div className="mb-5">
                <p className={`text-xs font-medium mb-1 ${plan.popular ? 'text-gray-400' : 'text-gray-400'}`}>
                  {plan.desc}
                </p>
                <p className={`text-2xl font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                  <span className={`text-sm font-normal ml-1 ${plan.popular ? 'text-gray-400' : 'text-gray-400'}`}>
                    FCFA/mois
                  </span>
                </p>
                <p className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 size={14} className={plan.popular ? 'text-green-400' : 'text-gray-400'} />
                    <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={`https://dashboard.skanema.com/onboarding?plan=${plan.name.toLowerCase()}`}
                    className={`block text-center py-3 rounded-xl text-sm font-medium transition-all ${
                      plan.popular
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name  : 'Fatou Diallo',
      role  : 'Propriétaire, Chez Fatou — Dakar',
      text  : 'Avant Skanema, je gérais les commandes à la main sur WhatsApp. Maintenant le bot fait tout. Je reçois juste la notification et je prépare.',
      rating: 5,
    },
    {
      name  : 'Mamadou Sow',
      role  : 'Gérant, Saveurs du Fouta — Dakar',
      text  : 'Le paiement Wave intégré a tout changé. Mes clients paient directement, je n\'ai plus à courir après les paiements.',
      rating: 5,
    },
    {
      name  : 'Aminata Koné',
      role  : 'Cheffe, La Table d\'Aminata — Abidjan',
      text  : 'Installation en 15 minutes chrono. Mon bot est actif depuis 2 mois et mes commandes ont augmenté de 40%.',
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-5 sm:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Témoignages</div>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Ils font confiance à Skanema
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.text}"</p>
              <div>
                <p className="text-sm font-medium text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null)

  const faqs = [
    {
      q: 'Est-ce que j\'ai besoin d\'un compte WhatsApp Business ?',
      a: 'Oui, vous avez besoin d\'un compte WhatsApp Business API via Meta. Nous vous guidons étape par étape lors de l\'onboarding. C\'est gratuit à créer.',
    },
    {
      q: 'Comment fonctionne le paiement Wave ?',
      a: 'Vous avez besoin d\'un compte Wave Business. Une fois configuré, le bot génère automatiquement un lien de paiement pour chaque commande. Vous recevez l\'argent directement sur votre compte Wave.',
    },
    {
      q: 'Puis-je tester avant de m\'abonner ?',
      a: 'Oui, tous les plans incluent 14 jours d\'essai gratuit, sans carte bancaire. Vous pouvez annuler à tout moment.',
    },
    {
      q: 'Que se passe-t-il si un client est hors de ma zone de livraison ?',
      a: 'Le bot détecte automatiquement si le client est hors zone et l\'en informe poliment. Vous pouvez configurer jusqu\'à 3 zones de livraison sur le plan Pro, et illimitées sur Premium.',
    },
    {
      q: 'Est-ce que ça marche dans d\'autres pays que le Sénégal ?',
      a: 'Oui ! Skanema fonctionne dans tous les pays où WhatsApp est disponible. Le paiement Wave fonctionne au Sénégal, Mali, Côte d\'Ivoire et Guinée. D\'autres moyens de paiement seront ajoutés prochainement.',
    },
    {
      q: 'Comment modifier mon menu ?',
      a: 'Depuis votre dashboard Skanema, vous pouvez ajouter, modifier ou supprimer des plats à tout moment. Les changements sont répercutés instantanément sur le bot.',
    },
  ]

  return (
    <section id="faq" className="py-20 px-5 sm:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">FAQ</div>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Questions fréquentes</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                <ChevronRight
                  size={16}
                  className={`text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${open === i ? 'rotate-90' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Final ─────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="py-20 px-5 sm:px-8 bg-gray-900">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
          Prêt à digitaliser votre restaurant ?
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Rejoignez les restaurants qui utilisent Skanema pour automatiser leurs commandes
          et augmenter leurs ventes.
        </p>
        <Link href="https://dashboard.skanema.com/onboarding"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-medium
                         px-8 py-4 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all text-sm">
          Démarrer gratuitement — 14 jours <ArrowRight size={16} />
        </Link>
        <p className="text-gray-600 text-xs mt-4">Sans carte bancaire · Annulation à tout moment</p>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-10 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <p className="text-white font-semibold text-lg">Skanema</p>
            <p className="text-gray-500 text-xs mt-0.5">Plateforme de commande WhatsApp pour restaurants </p>
            <p className="text-gray-600 text-xs mt-3">Une solution <span className="text-gray-400">TERYAT</span></p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Légal</p>
            <a href="/mentions-legales" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Mentions légales</a>
            <a href="/politique-de-confidentialite" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Politique de confidentialité</a>
            <a href="/cgu" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Conditions d'utilisation</a>
            <a href="/cgv" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">Conditions générales de vente</a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Contact</p>
            <a href="mailto:contact@skanema.com" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">contact@skanema.com</a>
            <a href="https://wa.me/221784632103" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">WhatsApp Support</a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Skanema · TERYAT · NINEA 012949957</p>
          <p className="text-gray-700 text-xs">Dakar, Sénégal</p>
        </div>
      </div>
    </footer>
  )
}

// ── Page complète ─────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Nav />
      <Hero />
      <SocialProof />
      <Demo />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  )
}
