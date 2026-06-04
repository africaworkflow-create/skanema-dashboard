'use client'
import { useState, useEffect } from 'react'
import { Bell, BellOff, X, Smartphone, Share, MoreVertical, Plus } from 'lucide-react'
import Cookies from 'js-cookie'

const API_URL       = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'
const VAPID_PUB_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const rawData = atob(base64)
  const buffer  = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    buffer[i] = rawData.charCodeAt(i)
  }
  return buffer
}

function detectDevice() {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true
}

export function PushNotificationSetup() {
  const [status,     setStatus]     = useState('idle') // idle | granted | denied | unsupported
  const [device,     setDevice]     = useState('desktop')
  const [showGuide,  setShowGuide]  = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed,  setDismissed]  = useState(false)
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    const d = detectDevice()
    setDevice(d)
    setIsStandalone(isInStandaloneMode())

    // Vérifie si déjà dismissé
    if (localStorage.getItem('skanema_push_dismissed')) {
      setDismissed(true)
      return
    }

    // Vérifie le statut actuel
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported')
      return
    }
    setStatus(Notification.permission)
  }, [])

  const registerServiceWorker = async () => {
    const reg = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready
    return reg
  }

  const subscribePush = async () => {
    setLoading(true)
    try {
      const reg = await registerServiceWorker()
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly     : true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUB_KEY),
      })

      const token = Cookies.get('skanema_token')
      await fetch(`${API_URL}/api/push/subscribe`, {
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json',
          Authorization  : `Bearer ${token}`,
        },
        body: JSON.stringify(sub.toJSON()),
      })

      setStatus('granted')
      localStorage.setItem('skanema_push_dismissed', '1')
    } catch (err) {
      console.error('Push subscription error:', err)
      setStatus(Notification.permission)
    } finally {
      setLoading(false)
    }
  }

  const handleEnable = async () => {
    if (device === 'ios' && !isStandalone) {
      setShowGuide(true)
      return
    }

    const permission = await Notification.requestPermission()
    setStatus(permission)
    if (permission === 'granted') await subscribePush()
  }

  const handleDismiss = () => {
    localStorage.setItem('skanema_push_dismissed', '1')
    setDismissed(true)
  }

  // Ne rien afficher si déjà accordé, dismissed ou non supporté
  if (dismissed || status === 'granted' || status === 'unsupported') return null

  return (
    <>
      {/* Bannière principale */}
      {!showGuide && (
        <div className="bg-gray-900 rounded-xl p-4 mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DC2626] flex items-center justify-center flex-shrink-0">
              <Bell size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Activez les notifications push
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Pour ne rater aucune commande — recevez une alerte immédiate même app fermée.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleEnable}
                  disabled={loading}
                  className="bg-[#DC2626] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {loading ? 'Activation…' : 'Activer maintenant'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-2"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-gray-600 hover:text-gray-400 flex-shrink-0 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Guide d'installation iOS */}
      {showGuide && (
        <div className="bg-gray-900 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">Installer Skanema sur votre iPhone</p>
            <button onClick={() => setShowGuide(false)} className="text-gray-500 hover:text-gray-300">
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-[#DC2626] font-semibold mb-4">
            📦 Pour ne rater aucune commande, installez d'abord l'app sur votre écran d'accueil
          </p>

          <div className="space-y-4">
            {/* Étape 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">1</div>
              <div>
                <p className="text-xs font-medium text-white mb-1">Appuyez sur le bouton Partager</p>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 w-fit">
                  <Share size={16} className="text-blue-400" />
                  <span className="text-xs text-gray-300">Bouton en bas de Safari</span>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">2</div>
              <div>
                <p className="text-xs font-medium text-white mb-1">Faites défiler et appuyez sur</p>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 w-fit">
                  <Plus size={16} className="text-gray-300" />
                  <span className="text-xs text-gray-300">Sur l'écran d'accueil</span>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">3</div>
              <div>
                <p className="text-xs font-medium text-white mb-1">Appuyez sur <span className="text-[#DC2626]">Ajouter</span> en haut à droite</p>
                <p className="text-xs text-gray-400">L'icône Skanema apparaîtra sur votre écran d'accueil</p>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">✓</div>
              <div>
                <p className="text-xs font-medium text-white mb-1">Ouvrez Skanema depuis votre écran d'accueil</p>
                <p className="text-xs text-[#DC2626] font-medium">→ Pour ne rater aucune commande</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Je le ferai plus tard
          </button>
        </div>
      )}
    </>
  )
}
