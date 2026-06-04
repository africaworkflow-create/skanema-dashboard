'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const COUNTRIES = [
  { code: 'SN', name: 'Sénégal',              dial: '221', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire',        dial: '225', flag: '🇨🇮' },
  { code: 'ML', name: 'Mali',                  dial: '223', flag: '🇲🇱' },
  { code: 'GN', name: 'Guinée',                dial: '224', flag: '🇬🇳' },
  { code: 'BF', name: 'Burkina Faso',          dial: '226', flag: '🇧🇫' },
  { code: 'NE', name: 'Niger',                 dial: '227', flag: '🇳🇪' },
  { code: 'TG', name: 'Togo',                  dial: '228', flag: '🇹🇬' },
  { code: 'BJ', name: 'Bénin',                 dial: '229', flag: '🇧🇯' },
  { code: 'MR', name: 'Mauritanie',            dial: '222', flag: '🇲🇷' },
  { code: 'CM', name: 'Cameroun',              dial: '237', flag: '🇨🇲' },
  { code: 'SL', name: 'Sierra Leone',          dial: '232', flag: '🇸🇱' },
  { code: 'GW', name: 'Guinée-Bissau',         dial: '245', flag: '🇬🇼' },
  { code: 'GH', name: 'Ghana',                 dial: '233', flag: '🇬🇭' },
  { code: 'NG', name: 'Nigeria',               dial: '234', flag: '🇳🇬' },
  { code: 'GA', name: 'Gabon',                 dial: '241', flag: '🇬🇦' },
  { code: 'CG', name: 'Congo',                 dial: '242', flag: '🇨🇬' },
  { code: 'CD', name: 'RD Congo',              dial: '243', flag: '🇨🇩' },
  { code: 'MA', name: 'Maroc',                 dial: '212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie',               dial: '213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie',               dial: '216', flag: '🇹🇳' },
  { code: 'FR', name: 'France',                dial: '33',  flag: '🇫🇷' },
]

// Détecte le pays via l'IP — fallback SN
async function detectCountry() {
  try {
    const res  = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
    const data = await res.json()
    return COUNTRIES.find(c => c.code === data.country_code) || COUNTRIES[0]
  } catch (_) {
    return COUNTRIES[0] // Sénégal par défaut
  }
}

// Pays qui gardent le 0 comme préfixe local
const KEEPS_LEADING_ZERO = ['225', '237', '233', '234', '241', '242', '243', '212', '213', '33']

// Normalise le numéro — retire le préfixe pays si déjà inclus
function normalizeLocal(number, dialCode) {
  let digits = number.replace(/\D/g, '')
  if (digits.startsWith(dialCode)) digits = digits.slice(dialCode.length)
  // Retire le 0 initial seulement si le pays ne l'utilise pas
  if (digits.startsWith('0') && !KEEPS_LEADING_ZERO.includes(dialCode))
    digits = digits.slice(1)
  return digits
}

export function PhoneInput({ value, onChange, style }) {
  const [selected,  setSelected]  = useState(COUNTRIES[0])
  const [search,    setSearch]    = useState('')
  const [open,      setOpen]      = useState(false)
  const [localNum,  setLocalNum]  = useState('')
  const [detecting, setDetecting] = useState(true)
  const dropdownRef = useRef(null)
  const inputRef    = useRef(null)

  // Détection automatique du pays
  useEffect(() => {
    detectCountry().then(country => {
      setSelected(country)
      setDetecting(false)
    })
  }, [])

  // Ferme dropdown en cliquant dehors
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (country) => {
    setSelected(country)
    setOpen(false)
    setSearch('')
    // Met à jour le numéro complet
    const full = localNum ? '+' + country.dial + localNum : ''
    onChange(full, country.dial, localNum)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleNumberChange = (e) => {
  const raw   = e.target.value.replace(/\D/g, '')
  const local = normalizeLocal(raw, selected.dial)
  
  // Retire automatiquement tout préfixe pays détecté
  // (ex: si SN sélectionné et numéro commence par 225, on retire 225)
  const otherDial = COUNTRIES.find(c => c.code !== selected.code && local.startsWith(c.dial))
  const cleaned   = otherDial ? local.slice(otherDial.dial.length) : local

  setLocalNum(cleaned)
  const full = cleaned ? '+' + selected.dial + cleaned : ''
  onChange(full, selected.dial, cleaned)
}

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  )

  return (
    <div className="flex gap-2" ref={dropdownRef}>
      {/* Sélecteur pays */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 h-full
                     hover:border-gray-300 transition-colors bg-white min-w-[90px]"
          style={style}
        >
          {detecting ? (
            <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          ) : (
            <>
              <span style={{ fontSize: '18px' }}>{selected.flag}</span>
              <span className="text-sm text-gray-700">+{selected.dial}</span>
              <ChevronDown size={12} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100
                          rounded-2xl shadow-xl z-50 overflow-hidden w-64"
               style={{ animation: 'fadeDown 0.15s ease' }}>
            <style>{`@keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Recherche */}
            <div className="p-2 border-b border-gray-50">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un pays…"
                  style={{ fontSize: '16px' }}
                  className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Liste pays */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.map(country => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50
                              transition-colors text-left ${
                    selected.code === country.code ? 'bg-gray-50' : ''
                  }`}
                >
                  <span style={{ fontSize: '18px' }}>{country.flag}</span>
                  <span className="text-xs text-gray-700 flex-1">{country.name}</span>
                  <span className="text-xs text-gray-400">+{country.dial}</span>
                  {selected.code === country.code && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 flex-shrink-0" />
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">Aucun pays trouvé</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input numéro */}
      <input
        ref={inputRef}
        type="tel"
        value={localNum}
        onChange={handleNumberChange}
        placeholder="77 123 45 67"
        style={{ fontSize: '16px', ...style }}
        className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 outline-none
                   focus:border-gray-400 transition-colors placeholder-gray-300"
      />
    </div>
  )
}

// Fonction utilitaire exportée pour normaliser côté backend
export function buildFullPhone(dialCode, localNumber) {
  const digits = localNumber.replace(/\D/g, '')
  return digits ? '+' + dialCode + digits : ''
}
