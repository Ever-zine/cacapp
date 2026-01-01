export type PoopType = 
  | 'type1' // Selles dures en morceaux séparés
  | 'type2' // En forme de saucisse mais grumeleuse
  | 'type3' // En forme de saucisse avec des fissures
  | 'type4' // Lisse et molle en forme de serpent
  | 'type5' // Morceaux mous avec des bords nets
  | 'type6' // Morceaux duveteux avec des bords déchiquetés
  | 'type7' // Aqueuse, pas de morceaux solides

export const POOP_TYPES: { value: PoopType; label: string; emoji: string; description: string }[] = [
  { value: 'type1', label: 'Type 1', emoji: '🫘', description: 'Billes dures séparées' },
  { value: 'type2', label: 'Type 2', emoji: '🌰', description: 'Saucisse grumeleuse' },
  { value: 'type3', label: 'Type 3', emoji: '🌭', description: 'Saucisse avec fissures' },
  { value: 'type4', label: 'Type 4', emoji: '🐍', description: 'Lisse comme un serpent (idéal!)' },
  { value: 'type5', label: 'Type 5', emoji: '☁️', description: 'Morceaux mous' },
  { value: 'type6', label: 'Type 6', emoji: '🍂', description: 'Flocons déchiquetés' },
  { value: 'type7', label: 'Type 7', emoji: '💧', description: 'Liquide' },
]
export type PoopSize = 'small' | 'medium' | 'normal' | 'big' | 'monster' | 'destroyer'

export const POOP_SIZES: { value: PoopSize; label: string; emoji: string }[] = [
  { value: 'small', label: 'Petit', emoji: '🤏' },
  { value: 'medium', label: 'Moyen', emoji: '👌' },
  { value: 'normal', label: 'Normal', emoji: '👍' },
  { value: 'big', label: 'Gros', emoji: '💪' },
  { value: 'monster', label: 'Brown monster', emoji: '👹' },
  { value: 'destroyer', label: 'Toilet destroyer', emoji: '💥' },
]
export interface PoopLog {
  id: string
  user_id: string
  date: string
  time: string
  location: string
  address: string | null
  latitude: number | null
  longitude: number | null
  poop_type: PoopType
  size: PoopSize
  comments: string | null
  created_at: string
}

export interface PoopLogInsert {
  date: string
  time: string
  location: string
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  poop_type: PoopType
  size: PoopSize
  comments?: string | null
}

export interface LocationTag {
  id: string
  user_id: string
  name: string
  emoji: string
  created_at: string
}

// Profil utilisateur
export type AccentColor = 'amber' | 'red' | 'orange' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

export const ACCENT_COLORS: { value: AccentColor; label: string; hex: string }[] = [
  { value: 'amber', label: 'Ambre', hex: '#f59e0b' },
  { value: 'red', label: 'Rouge', hex: '#ef4444' },
  { value: 'orange', label: 'Orange', hex: '#f97316' },
  { value: 'yellow', label: 'Jaune', hex: '#eab308' },
  { value: 'lime', label: 'Citron vert', hex: '#84cc16' },
  { value: 'green', label: 'Vert', hex: '#22c55e' },
  { value: 'emerald', label: 'Émeraude', hex: '#10b981' },
  { value: 'teal', label: 'Sarcelle', hex: '#14b8a6' },
  { value: 'cyan', label: 'Cyan', hex: '#06b6d4' },
  { value: 'sky', label: 'Ciel', hex: '#0ea5e9' },
  { value: 'blue', label: 'Bleu', hex: '#3b82f6' },
  { value: 'indigo', label: 'Indigo', hex: '#6366f1' },
  { value: 'violet', label: 'Violet', hex: '#8b5cf6' },
  { value: 'purple', label: 'Pourpre', hex: '#a855f7' },
  { value: 'fuchsia', label: 'Fuchsia', hex: '#d946ef' },
  { value: 'pink', label: 'Rose', hex: '#ec4899' },
  { value: 'rose', label: 'Rosé', hex: '#f43f5e' },
]

export const AVATAR_EMOJIS = [
  '💩', '😎', '🤠', '🥳', '👻', '👽', '🤖', '🐶', '🐱', '🦁',
  '🐻', '🐼', '🐨', '🦊', '🦉', '🦄', '🐉', '🦖', '🐙', '🧚',
  '🧙', '🧛', '🧜', '🧞', '🧟', '🥷', '🥸', '🌟', '🔥', '✨'
]

export interface UserProfile {
  id: string
  user_id: string
  pseudo: string | null
  avatar_emoji: string
  accent_color: AccentColor
  created_at: string
  updated_at: string
}
