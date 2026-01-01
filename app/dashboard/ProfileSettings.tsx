'use client'

import { useState } from 'react'
import { UserProfile, AccentColor, ACCENT_COLORS, AVATAR_EMOJIS } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface ProfileSettingsProps {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
  onCancel: () => void
}

export default function ProfileSettings({ profile, onSave, onCancel }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    pseudo: profile.pseudo || '',
    avatar_emoji: profile.avatar_emoji || '💩',
    accent_color: profile.accent_color || 'amber' as AccentColor,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        pseudo: formData.pseudo || null,
        avatar_emoji: formData.avatar_emoji,
        accent_color: formData.accent_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    if (data) {
      onSave(data as UserProfile)
    }
    setLoading(false)
  }

  const currentColor = ACCENT_COLORS.find(c => c.value === formData.accent_color) || ACCENT_COLORS[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Pseudo */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          ✏️ Pseudo
        </label>
        <input
          type="text"
          value={formData.pseudo}
          onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
          placeholder="Votre pseudo..."
          maxLength={50}
          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:ring-2 focus:border-transparent dark:bg-zinc-800 dark:text-white"
          style={{ '--tw-ring-color': currentColor.hex } as React.CSSProperties}
        />
      </div>

      {/* Avatar Emoji */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          🎭 Avatar (emoji)
        </label>
        <div className="flex flex-wrap gap-2">
          {AVATAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setFormData({ ...formData, avatar_emoji: emoji })}
              className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all hover:scale-110 ${
                formData.avatar_emoji === emoji
                  ? 'border-current shadow-lg scale-110'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
              style={formData.avatar_emoji === emoji ? { borderColor: currentColor.hex, backgroundColor: `${currentColor.hex}20` } : {}}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Couleur d'accentuation */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          🎨 Couleur d'accentuation
        </label>
        <div className="grid grid-cols-6 gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, accent_color: color.value })}
              title={color.label}
              className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                formData.accent_color === color.value
                  ? 'border-zinc-800 dark:border-white scale-110 ring-2 ring-offset-2'
                  : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
              style={{ 
                backgroundColor: color.hex,
                '--tw-ring-color': color.hex,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
          Sélectionné : <span style={{ color: currentColor.hex }} className="font-semibold">{currentColor.label}</span>
        </p>
      </div>

      {/* Aperçu */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">Aperçu :</p>
        <div className="flex items-center gap-3">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${currentColor.hex}20`, border: `2px solid ${currentColor.hex}` }}
          >
            {formData.avatar_emoji}
          </div>
          <div>
            <p className="font-bold text-zinc-800 dark:text-zinc-100">
              {formData.pseudo || 'Anonyme'}
            </p>
            <p className="text-sm" style={{ color: currentColor.hex }}>
              Couleur {currentColor.label}
            </p>
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: currentColor.hex }}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
