'use client'
import { useState, useEffect, useRef } from 'react'
import { QrCode, Share2, Download, Wifi, WifiOff } from 'lucide-react'
import api from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

export function QRCodeSection() {
  const [qrData,   setQrData]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [toggling, setToggling] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    api.get('/api/qr/me').then(res => {
      setQrData(res.data.qr)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Génère le QR code via API Google Charts (simple, fiable)
  const qrImageUrl = qrData?.url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData.url)}&bgcolor=ffffff&color=000000&margin=10`
    : null

  const handleShare = async () => {
    if (!qrData?.url) return
    if (navigator.share) {
      await navigator.share({
        title: 'Mon QR Code Skanema',
        text : 'Scannez ce QR code pour commander directement sur WhatsApp',
        url  : qrData.url,
      })
    } else {
      navigator.clipboard.writeText(qrData.url)
    }
  }

  const handleDownload = () => {
    if (!qrImageUrl) return
    const a = document.createElement('a')
    a.href = qrImageUrl
    a.download = `qr-skanema-${qrData.code}.png`
    a.click()
  }

  const handleToggleDestination = async () => {
    if (!qrData) return
    setToggling(true)
    const next = qrData.destination === 'whatsapp' ? 'menu' : 'whatsapp'
    try {
      await api.patch('/api/qr/destination', { destination: next })
      setQrData(prev => ({ ...prev, destination: next }))
    } catch (_) {}
    finally { setToggling(false) }
  }

  if (loading) return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="animate-pulse h-4 bg-gray-100 rounded w-32 mb-4" />
      <div className="animate-pulse h-48 bg-gray-100 rounded" />
    </div>
  )

  if (!qrData) return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <QrCode size={15} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-900">Mon QR Code</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <QrCode size={32} className="text-gray-200 mb-3" />
        <p className="text-sm text-gray-400">QR code en cours de préparation</p>
        <p className="text-xs text-gray-300 mt-1">Skanema vous enverra votre pack sous peu</p>
      </div>
    </div>
  )

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <QrCode size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Mon QR Code</h2>
        </div>
        <span className="text-xs text-gray-400 font-mono">{qrData.code}</span>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          {qrImageUrl && (
            <img src={qrImageUrl} alt="QR Code" width={200} height={200} className="rounded-xl" />
          )}
        </div>
      </div>

      {/* Destination */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          {qrData.destination === 'whatsapp'
            ? <Wifi size={14} className="text-green-500" />
            : <WifiOff size={14} className="text-gray-400" />
          }
          <div>
            <p className="text-xs font-medium text-gray-900">
              {qrData.destination === 'whatsapp' ? 'Redirige vers WhatsApp' : 'Redirige vers le menu web'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{qrData.scanCount} scan{qrData.scanCount > 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={handleToggleDestination} disabled={toggling}
          className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors">
          {toggling ? '...' : 'Changer'}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
          <Share2 size={13} />
          Partager
        </button>
        <button onClick={handleDownload}
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-200 transition-colors">
          <Download size={13} />
          PNG
        </button>
      </div>
    </div>
  )
}
