'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, ImageIcon, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''

export function ImageUpload({ value, onChange, disabled }) {
  const [mode,       setMode]       = useState('upload') // 'upload' | 'url'
  const [uploading,  setUploading]  = useState(false)
  const [error,      setError]      = useState('')
  const [dragOver,   setDragOver]   = useState(false)
  const [urlInput,   setUrlInput]   = useState(value || '')
  const inputRef = useRef(null)

  const uploadToCloudinary = useCallback(async (file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      // Fallback : crée une URL locale temporaire pour tester sans Cloudinary
      const localUrl = URL.createObjectURL(file)
      onChange(localUrl)
      return
    }
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file',         file)
      fd.append('upload_preset', UPLOAD_PRESET)
      fd.append('folder',       'skanema/menu')
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST', body: fd,
      })
      const data = await res.json()
      if (data.secure_url) {
        onChange(data.secure_url)
      } else {
        setError('Upload échoué. Vérifiez vos credentials Cloudinary.')
      }
    } catch (_) {
      setError('Erreur réseau lors de l\'upload.')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Fichier non supporté. Utilisez JPG, PNG ou WebP.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('Image trop lourde (max 5 MB).'); return }
    setError('')
    uploadToCloudinary(file)
  }, [uploadToCloudinary])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleUrlConfirm = () => {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    setError('')
  }

  const clear = () => {
    onChange('')
    setUrlInput('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      {/* Tabs mode */}
      <div className="flex bg-gray-100 rounded-lg p-0.5 w-fit gap-0.5">
        {[
          { id: 'upload', label: 'Mon appareil', icon: Upload },
          { id: 'url',    label: 'Lien URL',     icon: Link2  },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
              mode === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Mode upload */}
      {mode === 'upload' && (
        <>
          {value ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 group">
              <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="bg-white text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Upload size={12} /> Changer
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="bg-white text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <X size={12} /> Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2',
                'cursor-pointer transition-all duration-150',
                dragOver     ? 'border-gray-400 bg-gray-50'  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                uploading    && 'pointer-events-none opacity-60'
              )}
            >
              {uploading ? (
                <>
                  <Loader2 size={22} className="animate-spin text-gray-400" />
                  <p className="text-xs text-gray-400">Upload en cours…</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-700">Glissez une image ici</p>
                    <p className="text-xs text-gray-400 mt-0.5">ou cliquez pour parcourir · JPG, PNG, WebP · max 5 MB</p>
                  </div>
                </>
              )}
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
            disabled={disabled || uploading}
          />
        </>
      )}

      {/* Mode URL */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="input flex-1 text-xs"
              onKeyDown={e => e.key === 'Enter' && handleUrlConfirm()}
            />
            <button
              type="button"
              onClick={handleUrlConfirm}
              className="btn-primary text-xs px-3 py-2 whitespace-nowrap"
            >
              Utiliser
            </button>
          </div>
          {value && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={value}
                alt="Aperçu"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display='none'; setError('URL invalide ou image inaccessible.') }}
              />
              <button
                type="button"
                onClick={clear}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
              >
                <X size={12} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {!CLOUD_NAME && mode === 'upload' && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Configurez <code className="font-mono">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> dans <code className="font-mono">.env.local</code> pour activer l'upload depuis l'appareil.
        </p>
      )}
    </div>
  )
}
