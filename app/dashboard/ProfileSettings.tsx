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
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{error}</div>}

      <div className="flex items-center gap-4 rounded-3xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${currentColor.hex}, #2b2119)` }}>
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.65rem] bg-white/16 text-4xl ring-1 ring-white/25">{formData.avatar_emoji}</div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/60">Votre identité</p>
          <p className="mt-2 truncate text-2xl font-black tracking-[-0.04em]">{formData.pseudo || 'Anonyme'}</p>
          <p className="mt-1 text-sm font-semibold text-white/70">Accent {currentColor.label.toLowerCase()}</p>
        </div>
      </div>

      <label className="block text-sm font-black">Votre pseudo
        <input type="text" value={formData.pseudo} onChange={event => setFormData({ ...formData, pseudo: event.target.value })} placeholder="Comment doit-on vous appeler ?" maxLength={50} className="app-field mt-2" />
      </label>

      <fieldset>
        <legend className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Choisir un avatar</legend>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
          {AVATAR_EMOJIS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setFormData({ ...formData, avatar_emoji: emoji })}
              className={`aspect-square rounded-2xl border text-2xl transition-all ${formData.avatar_emoji === emoji ? 'scale-105 shadow-sm' : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]'}`}
              style={formData.avatar_emoji === emoji ? { borderColor: currentColor.hex, backgroundColor: `${currentColor.hex}20` } : undefined}
              aria-pressed={formData.avatar_emoji === emoji}
              aria-label={`Avatar ${emoji}`}
            >{emoji}</button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <div className="mb-3 flex items-center justify-between gap-3">
          <legend className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Couleur d’accent</legend>
          <span className="text-xs font-black" style={{ color: currentColor.hex }}>{currentColor.label}</span>
        </div>
        <div className="grid grid-cols-9 gap-2">
          {ACCENT_COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, accent_color: color.value })}
              title={color.label}
              aria-label={`Couleur ${color.label}`}
              aria-pressed={formData.accent_color === color.value}
              className={`aspect-square rounded-full border-[3px] border-[var(--surface)] shadow-sm transition-transform hover:scale-110 ${formData.accent_color === color.value ? 'scale-110 ring-2 ring-[var(--foreground)] ring-offset-2 ring-offset-[var(--surface)]' : ''}`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button type="button" onClick={onCancel} className="app-button-secondary">Annuler</button>
        <button type="submit" disabled={loading} className="app-button-primary" style={{ backgroundColor: currentColor.hex }}>
          {loading ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
