'use client'

import { useState, useEffect } from 'react'
import { PoopLog, PoopType, POOP_TYPES } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface AddPoopFormProps {
  onSuccess: (log: PoopLog) => void
  onCancel: () => void
}

export default function AddPoopForm({ onSuccess, onCancel }: AddPoopFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Valeurs par défaut : maintenant
  const now = new Date()
  const defaultDate = now.toISOString().split('T')[0]
  const defaultTime = now.toTimeString().slice(0, 5)

  const [formData, setFormData] = useState({
    date: defaultDate,
    time: defaultTime,
    location: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    poop_type: 'type4' as PoopType,
    comments: '',
  })

  const [geoStatus, setGeoStatus] = useState<'loading' | 'success' | 'error' | 'denied'>('loading')

  // Récupérer la géolocalisation automatiquement au chargement
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({ ...prev, latitude, longitude }))
        
        // Reverse geocoding pour obtenir l'adresse
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'fr' } }
          )
          const data = await response.json()
          if (data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }))
            setGeoStatus('success')
          }
        } catch {
          // Si le reverse geocoding échoue, on garde juste les coordonnées
          setGeoStatus('success')
        }
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error)
        setGeoStatus(error.code === 1 ? 'denied' : 'error')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id ?? null

    const { error } = await supabase.from('poop_logs').insert({
      user_id: userId,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      address: formData.address || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      poop_type: formData.poop_type,
      comments: formData.comments || null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Récupérer le log créé
    const { data } = await supabase
      .from('poop_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (data) {
      onSuccess(data as PoopLog)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            📅 Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            ⏰ Heure
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          📍 Lieu
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          placeholder="Maison, Bureau, Restaurant..."
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          🗺️ Adresse (géolocalisation)
          {geoStatus === 'loading' && (
            <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">⏳ Localisation en cours...</span>
          )}
          {geoStatus === 'success' && (
            <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Localisé</span>
          )}
          {geoStatus === 'denied' && (
            <span className="ml-2 text-xs text-red-600 dark:text-red-400">⚠️ Accès refusé</span>
          )}
          {geoStatus === 'error' && (
            <span className="ml-2 text-xs text-red-600 dark:text-red-400">⚠️ Non disponible</span>
          )}
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder={geoStatus === 'loading' ? 'Récupération de l\'adresse...' : 'Adresse (optionnel)'}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
        />
        {formData.latitude && formData.longitude && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            📌 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          💩 Type (Échelle de Bristol)
        </label>
        <div className="grid grid-cols-1 gap-2">
          {POOP_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, poop_type: type.value })}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                formData.poop_type === type.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <span className="text-2xl">{type.emoji}</span>
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-100">{type.label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          📝 Commentaires (optionnel)
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="Notes, observations..."
          rows={2}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-zinc-800 dark:text-white resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer 💩'}
        </button>
      </div>
    </form>
  )
}
