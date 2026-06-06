'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { QrCode, Share2, Download, Wifi, WifiOff } from 'lucide-react'
import api from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

// Logo Skanema SVG path (deux rectangles arrondis + point)
function drawSkanemLogo(ctx, x, y, size, color = '#ffffff') {
  ctx.fillStyle = color
  const s = size

  // Rectangle gauche grand (incliné)
  ctx.save()
  ctx.translate(x, y + s * 0.1)
  ctx.rotate(-0.12)
  roundRect(ctx, 0, 0, s * 0.32, s * 0.55, s * 0.07)
  ctx.fill()
  ctx.restore()

  // Rectangle droit petit (incliné autre sens)
  ctx.save()
  ctx.translate(x + s * 0.38, y + s * 0.18)
  ctx.rotate(0.08)
  roundRect(ctx, 0, 0, s * 0.28, s * 0.48, s * 0.06)
  ctx.fill()
  ctx.restore()

  // Point blanc (trou dans rectangle droit)
  ctx.fillStyle = '#DC2626'
  ctx.beginPath()
  ctx.arc(x + s * 0.52, y + s * 0.54, s * 0.055, 0, Math.PI * 2)
  ctx.fill()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function generateTemplate(qrUrl, format) {
  const canvas = document.createElement('canvas')
  const isPortrait = format === 'portrait'

  // Dimensions haute résolution (300 DPI équivalent)
  const W = isPortrait ? 1200 : 1400
  const H = isPortrait ? 1680 : 1400
  canvas.width  = W
  canvas.height = H

  const ctx = canvas.getContext('2d')

  // ── Fond rouge ───────────────────────────────────────────────
  ctx.fillStyle = '#DC2626'
  roundRect(ctx, 0, 0, W, H, isPortrait ? 80 : 100)
  ctx.fill()

  if (isPortrait) {
    // ── FORMAT PORTRAIT (comptoir) ───────────────────────────

    // Logo icon
    const logoSize = 110
    drawSkanemLogo(ctx, 80, 80, logoSize)

    // Texte SKANEMA
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 130px Inter, Arial, sans-serif'
    ctx.letterSpacing = '2px'
    ctx.fillText('SKANEMA', 210, 170)

    // Tagline
    ctx.font = '56px Inter, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.textAlign = 'center'
    ctx.fillText('Commande facile livraison rapide', W / 2, 280)

    // QR code sur fond blanc arrondi
    const qrSize  = 780
    const qrX     = (W - qrSize) / 2
    const qrY     = 360

    ctx.fillStyle = '#ffffff'
    roundRect(ctx, qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 60)
    ctx.fill()

    const qrImg = await loadImage(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff&color=000000&margin=0`)
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

    // Bas de page
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '40px Inter, Arial, sans-serif'
    ctx.fillText('skanema.com', W / 2, H - 60)

  } else {
    // ── FORMAT CARRÉ (sacs) ───────────────────────────────────

    // Logo + texte en haut
    const logoSize = 90
    const totalLogoW = logoSize + 20 + 340
    const startX = (W - totalLogoW) / 2

    drawSkanemLogo(ctx, startX, 80, logoSize)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 110px Inter, Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('SKANEMA', startX + logoSize + 20, 158)

    // Tagline
    ctx.font = '50px Inter, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.textAlign = 'center'
    ctx.fillText('Commande facile livraison rapide', W / 2, 240)

    // QR code
    const qrSize = 900
    const qrX    = (W - qrSize) / 2
    const qrY    = 310

    ctx.fillStyle = '#ffffff'
    roundRect(ctx, qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 60)
    ctx.fill()

    const qrImg = await loadImage(`https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff&color=000000&margin=0`)
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

    // Bas
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '38px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('skanema.com', W / 2, H - 50)
  }

  return canvas
}

export function QRCodeSection() {
  const [qrData,    setQrData]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [toggling,  setToggling]  = useState(false)
  const [generating, setGenerating] = useState(null) // 'portrait' | 'square' | null

  useEffect(() => {
    api.get('/api/qr/me').then(res => {
      setQrData(res.data.qr)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const qrPreviewUrl = qrData?.url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData.url)}&bgcolor=ffffff&color=000000&margin=10`
    : null

  const handleShare = async () => {
    if (!qrData?.url) return
    if (navigator.share) {
      await navigator.share({ title: 'Mon QR Code Skanema', url: qrData.url })
    } else {
      await navigator.clipboard.writeText(qrData.url)
    }
  }

  const handleDownload = async (format) => {
    if (!qrData?.url) return
    setGenerating(format)
    try {
      const canvas = await generateTemplate(qrData.url, format)
      canvas.toBlob(blob => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `skanema-qr-${format}-${qrData.code}.png`
        a.click()
      }, 'image/png')
    } catch (err) {
      console.error('Erreur génération template:', err)
    } finally {
      setGenerating(null)
    }
  }

  const handleToggle = async () => {
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
    <div className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
      <div className="h-48 bg-gray-100 rounded" />
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

      {/* Aperçu QR */}
      <div className="flex justify-center mb-4">
        <div className="bg-[#DC2626] rounded-2xl p-5 shadow-sm" style={{ width: 200 }}>
          <div className="bg-white rounded-xl p-3 mb-3">
            {qrPreviewUrl && <img src={qrPreviewUrl} alt="QR Code" width={150} height={150} className="rounded" />}
          </div>
          <p className="text-white text-center font-bold text-xs tracking-wide">SKANEMA</p>
          <p className="text-white/70 text-center text-xs mt-0.5">Commande facile</p>
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
        <button onClick={handleToggle} disabled={toggling}
          className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors">
          {toggling ? '...' : 'Changer'}
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
          <Share2 size={13} />
          Partager le lien
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => handleDownload('portrait')} disabled={!!generating}
            className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors">
            <Download size={12} />
            {generating === 'portrait' ? 'Génération…' : 'Sticker comptoir'}
          </button>
          <button onClick={() => handleDownload('square')} disabled={!!generating}
            className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors">
            <Download size={12} />
            {generating === 'square' ? 'Génération…' : 'Sticker sac'}
          </button>
        </div>
      </div>
    </div>
  )
}
