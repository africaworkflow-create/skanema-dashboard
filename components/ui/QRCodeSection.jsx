'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { QrCode, Share2, Download, Wifi, WifiOff } from 'lucide-react'
import api from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

// Logo chargé depuis public/
let _logoImg = null
async function getLogoImg() {
  if (_logoImg) return _logoImg
  _logoImg = await loadImage('https://dashboard.skanema.com/logo_red.png')
  return _logoImg
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

  const PAD = 80
  const logoImg = await getLogoImg()

  if (isPortrait) {
    // ── FORMAT PORTRAIT — proportions corrigées ───────────────
    // Logo grand — ~30% de la hauteur totale
    const logoH = 280
    const logoW = logoH * (logoImg.width / logoImg.height)
    ctx.drawImage(logoImg, (W - logoW) / 2, PAD, logoW, logoH)

    // Tagline — bien espacée du logo
    ctx.font = '58px Inter, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.textAlign = 'center'
    const tagY = PAD + logoH + 80
    ctx.fillText('Commande facile livraison rapide', W / 2, tagY)

    // QR code — 60% de la largeur seulement
    const qrPad  = 50
    const qrSize = Math.round(W * 0.62)
    const boxW   = qrSize + qrPad * 2
    const boxH   = boxW
    const boxX   = (W - boxW) / 2
    const boxY   = tagY + 80

    ctx.fillStyle = '#ffffff'
    roundRect(ctx, boxX, boxY, boxW, boxH, 60)
    ctx.fill()

    const qrImg = await loadImage('https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=' + encodeURIComponent(qrUrl) + '&bgcolor=ffffff&color=000000&margin=0')
    ctx.drawImage(qrImg, boxX + qrPad, boxY + qrPad, qrSize, qrSize)

    // skanema.com centré sous le QR
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '46px Inter, Arial, sans-serif'
    ctx.fillText('skanema.com', W / 2, boxY + boxH + 80)

  } else {
    // ── FORMAT CARRÉ — proportions corrigées ──────────────────
    const logoH = 240
    const logoW = logoH * (logoImg.width / logoImg.height)
    ctx.drawImage(logoImg, (W - logoW) / 2, PAD, logoW, logoH)

    ctx.font = '52px Inter, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.textAlign = 'center'
    const tagY = PAD + logoH + 70
    ctx.fillText('Commande facile livraison rapide', W / 2, tagY)

    const qrPad  = 50
    const qrSize = Math.round(W * 0.62)
    const boxW   = qrSize + qrPad * 2
    const boxH   = boxW
    const boxX   = (W - boxW) / 2
    const boxY   = tagY + 60

    ctx.fillStyle = '#ffffff'
    roundRect(ctx, boxX, boxY, boxW, boxH, 60)
    ctx.fill()

    const qrImg = await loadImage('https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=' + encodeURIComponent(qrUrl) + '&bgcolor=ffffff&color=000000&margin=0')
    ctx.drawImage(qrImg, boxX + qrPad, boxY + qrPad, qrSize, qrSize)

    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '42px Inter, Arial, sans-serif'
    ctx.fillText('skanema.com', W / 2, boxY + boxH + 70)
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
