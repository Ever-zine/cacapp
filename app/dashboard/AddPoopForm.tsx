'use client'

import { useState, useEffect } from 'react'
import { PoopLog, PoopType, POOP_TYPES, PoopSize, POOP_SIZES, LocationTag } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-[260px] animate-pulse rounded-2xl bg-[var(--surface-muted)]" />,
})

interface AddPoopFormProps {
  onSuccess: (log: PoopLog) => void
  onCancel: () => void
  editLog?: PoopLog | null // Log à éditer (optionnel)
  entryMode?: 'current' | 'backdated'
}

const getLocalDate = (offsetDays = 0) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AddPoopForm({ onSuccess, onCancel, editLog, entryMode = 'current' }: AddPoopFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const isEditMode = !!editLog
  
  // Valeurs par défaut : maintenant ou valeurs du log à éditer
  const now = new Date()
  const defaultDate = editLog?.date || (entryMode === 'backdated' ? getLocalDate(-1) : getLocalDate())
  const defaultTime = editLog?.time?.slice(0, 5) || now.toTimeString().slice(0, 5)

  const [formData, setFormData] = useState({
    date: defaultDate,
    time: defaultTime,
    location: editLog?.location || '',
    address: editLog?.address || '',
    latitude: editLog?.latitude ?? null as number | null,
    longitude: editLog?.longitude ?? null as number | null,
    poop_type: (editLog?.poop_type || 'type4') as PoopType,
    size: (editLog?.size || 'normal') as PoopSize,
    comments: editLog?.comments || '',
  })

  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'denied'>(isEditMode || entryMode === 'backdated' ? 'idle' : 'loading')
  const [positionSource, setPositionSource] = useState<'none' | 'automatic' | 'manual'>(
    editLog?.latitude !== null && editLog?.latitude !== undefined && editLog?.longitude !== null && editLog?.longitude !== undefined
      ? 'manual'
      : 'none'
  )
  const isManualLocation = isEditMode || entryMode === 'backdated' || formData.date < getLocalDate()
  
  // États pour les tags de lieu
  const [locationTags, setLocationTags] = useState<LocationTag[]>([])
  const [loadingTags, setLoadingTags] = useState(true)
  const [showNewTagInput, setShowNewTagInput] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagEmoji, setNewTagEmoji] = useState('📍')
  const [creatingTag, setCreatingTag] = useState(false)

  // Une entrée existante ou passée doit être placée manuellement, jamais avec la position actuelle.
  useEffect(() => {
    if (isManualLocation) return

    if (positionSource !== 'none') return
    
    if (!navigator.geolocation) {
      setGeoStatus('error')
      return
    }

    let cancelled = false
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (cancelled) return
        const { latitude, longitude } = position.coords
        setFormData(prev => ({ ...prev, latitude, longitude }))
        setGeoStatus('success')
        
        // Reverse geocoding pour obtenir l'adresse
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'fr' } }
          )
          const data = await response.json()
          if (!cancelled && data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }))
            setGeoStatus('success')
          }
        } catch {
          // Si le reverse geocoding échoue, on garde juste les coordonnées
          if (!cancelled) setGeoStatus('success')
        } finally {
          if (!cancelled) setPositionSource('automatic')
        }
      },
      (error) => {
        if (cancelled) return
        console.error('Erreur de géolocalisation:', error)
        setGeoStatus(error.code === 1 ? 'denied' : 'error')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )

    return () => {
      cancelled = true
    }
  }, [isManualLocation, positionSource])

  const handleLocationPicked = async (latitude: number, longitude: number) => {
    setFormData(prev => ({ ...prev, latitude, longitude }))
    setPositionSource('manual')
    setGeoStatus('success')

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'fr' } }
      )
      const data = await response.json()
      if (data.display_name) {
        setFormData(prev => prev.latitude === latitude && prev.longitude === longitude
          ? { ...prev, address: data.display_name }
          : prev)
      }
    } catch {
      // Le point sélectionné reste exploitable même sans adresse trouvée.
    }
  }

  const handleDateChange = (date: string) => {
    const becomesBackdated = date < getLocalDate()
    setFormData(prev => ({
      ...prev,
      date,
      ...(becomesBackdated && positionSource === 'automatic'
        ? { latitude: null, longitude: null, address: '' }
        : {}),
    }))

    if (becomesBackdated) {
      if (positionSource === 'automatic') setPositionSource('none')
      setGeoStatus('idle')
    }
  }

  // Charger les tags de lieu de l'utilisateur
  useEffect(() => {
    const loadLocationTags = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('location_tags')
        .select('*')
        .order('name', { ascending: true })
      
      if (data) {
        setLocationTags(data as LocationTag[])
      }
      setLoadingTags(false)
    }
    loadLocationTags()
  }, [])

  // Créer un nouveau tag de lieu
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return
    
    setCreatingTag(true)
    const supabase = createClient()
    
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    
    if (!userId) {
      setError('Utilisateur non connecté')
      setCreatingTag(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('location_tags')
      .insert({
        user_id: userId,
        name: newTagName.trim(),
        emoji: newTagEmoji || '📍'
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        setError('Ce lieu existe déjà')
      } else {
        setError(insertError.message)
      }
      setCreatingTag(false)
      return
    }

    if (data) {
      const newTag = data as LocationTag
      setLocationTags(prev => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)))
      setFormData(prev => ({ ...prev, location: newTag.name }))
      setNewTagName('')
      setNewTagEmoji('📍')
      setShowNewTagInput(false)
    }
    setCreatingTag(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id ?? null

    if (!userId) {
      setError('Utilisateur non connecté')
      setLoading(false)
      return
    }

    if (isEditMode && editLog) {
      // Mode édition : update
      const { data, error } = await supabase.from('poop_logs').update({
        date: formData.date,
        time: formData.time,
        location: formData.location,
        address: formData.address || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        poop_type: formData.poop_type,
        size: formData.size,
        comments: formData.comments || null,
      }).eq('id', editLog.id).eq('user_id', userId).select().single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data) {
        onSuccess(data as PoopLog)
      }
      setLoading(false)
      return
    }

    // Mode création : insert
    const { data, error } = await supabase.from('poop_logs').insert({
      user_id: userId,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      address: formData.address || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      poop_type: formData.poop_type,
      size: formData.size,
      comments: formData.comments || null,
    }).select().single()

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data) {
      onSuccess(data as PoopLog)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{error}</div>}

      <fieldset>
        <legend className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Quand&nbsp;?</legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-bold">Date
            <input type="date" value={formData.date} onChange={event => handleDateChange(event.target.value)} required className="app-field mt-2 px-3" />
          </label>
          <label className="text-sm font-bold">Heure
            <input type="time" value={formData.time} onChange={event => setFormData({ ...formData, time: event.target.value })} required className="app-field mt-2 px-3" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <div className="mb-3 flex items-center justify-between gap-3">
          <legend className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Où&nbsp;?</legend>
          {geoStatus === 'loading' && <span className="text-xs font-bold text-amber-600">Localisation…</span>}
          {geoStatus === 'success' && <span className="text-xs font-bold text-[var(--success)]">● Position enregistrée</span>}
          {geoStatus === 'denied' && <span className="text-xs font-bold text-[var(--danger)]">Accès refusé</span>}
          {geoStatus === 'error' && <span className="text-xs font-bold text-[var(--danger)]">Indisponible</span>}
        </div>

        {loadingTags ? (
          <div className="h-12 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {locationTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, location: tag.name })}
                  className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-extrabold transition-all ${formData.location === tag.name ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'}`}
                >
                  {tag.emoji} {tag.name}
                </button>
              ))}
              {!showNewTagInput && (
                <button type="button" onClick={() => setShowNewTagInput(true)} className="min-h-11 shrink-0 rounded-full border border-dashed border-[var(--border)] px-4 text-sm font-extrabold text-[var(--muted)]">＋ Nouveau lieu</button>
              )}
            </div>

            {showNewTagInput && (
              <div className="paper-card-soft mt-2 p-3">
                <div className="flex gap-2">
                  <input type="text" value={newTagEmoji} onChange={event => setNewTagEmoji(event.target.value)} placeholder="📍" maxLength={2} className="app-field w-16 px-2 text-center text-xl" aria-label="Emoji du lieu" />
                  <input type="text" value={newTagName} onChange={event => setNewTagName(event.target.value)} placeholder="Maison, travail…" className="app-field min-w-0 flex-1" autoFocus aria-label="Nom du lieu" />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setShowNewTagInput(false); setNewTagName(''); setNewTagEmoji('📍') }} className="app-button-secondary min-h-11 text-sm">Annuler</button>
                  <button type="button" onClick={handleCreateTag} disabled={!newTagName.trim() || creatingTag} className="app-button-primary min-h-11 text-sm">{creatingTag ? 'Création…' : 'Créer le lieu'}</button>
                </div>
              </div>
            )}

            {!formData.location && (
              <p className="mt-2 text-xs font-semibold text-[var(--brand)]">{locationTags.length > 0 ? 'Choisissez un lieu pour continuer.' : 'Créez votre premier lieu pour continuer.'}</p>
            )}
          </>
        )}

        <label className="mt-3 block text-sm font-bold">Adresse <span className="font-normal text-[var(--muted)]">· facultatif</span>
          <input type="text" value={formData.address} onChange={event => setFormData({ ...formData, address: event.target.value })} placeholder={geoStatus === 'loading' ? 'Recherche de l’adresse…' : 'Adresse ou repère'} className="app-field mt-2" />
        </label>
        {formData.latitude !== null && formData.longitude !== null && <p className="muted-copy mt-2 text-[11px]">Coordonnées · {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}</p>}
      </fieldset>

      {isManualLocation && (
        <fieldset>
          <legend className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Position précise</legend>
          <p className="muted-copy mb-3 mt-2 text-xs leading-5">Touchez la carte pour placer le point correspondant à cette entrée.</p>
          <LocationPicker latitude={formData.latitude} longitude={formData.longitude} onChange={handleLocationPicked} />
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Type · échelle de Bristol</legend>
        <div className="grid grid-cols-2 gap-2">
          {POOP_TYPES.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, poop_type: type.value })}
              className={`relative min-h-[5.5rem] rounded-2xl border p-3 text-left transition-all ${formData.poop_type === type.value ? 'border-[var(--brand)] bg-[var(--brand-soft)] shadow-sm' : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]'}`}
              aria-pressed={formData.poop_type === type.value}
            >
              <span className="text-2xl">{type.emoji}</span>
              <p className="mt-2 text-sm font-black">{type.label}</p>
              <p className="muted-copy mt-0.5 line-clamp-1 text-[10px]">{type.description}</p>
              {formData.poop_type === type.value && <span className="absolute right-2 top-2 text-sm font-black text-[var(--brand)]">✓</span>}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Taille</legend>
        <div className="grid grid-cols-3 gap-2">
          {POOP_SIZES.map(size => (
            <button
              key={size.value}
              type="button"
              onClick={() => setFormData({ ...formData, size: size.value })}
              className={`min-h-[4.75rem] rounded-2xl border p-2 text-center transition-all ${formData.size === size.value ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]' : 'border-[var(--border)] bg-[var(--surface)]'}`}
              aria-pressed={formData.size === size.value}
            >
              <span className="block text-xl">{size.emoji}</span>
              <span className="mt-1 block text-[11px] font-black leading-tight">{size.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Une note&nbsp;? <span className="font-medium normal-case tracking-normal">facultatif</span>
        <textarea value={formData.comments} onChange={event => setFormData({ ...formData, comments: event.target.value })} placeholder="Une sensation, un détail, une pensée…" rows={3} className="app-field mt-3 resize-none text-sm font-normal normal-case tracking-normal" />
      </label>

      <div className="sticky bottom-0 -mx-5 grid grid-cols-[.8fr_1.2fr] gap-2 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="button" onClick={onCancel} className="app-button-secondary">Annuler</button>
        <button type="submit" disabled={loading || !formData.location} className="app-button-primary">
          {loading ? 'Enregistrement…' : isEditMode ? 'Enregistrer les changements' : 'Ajouter au journal'}
        </button>
      </div>
    </form>
  )
}
