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

// Système de trophées
export type TrophyId = 
  | 'first_poop'
  | 'ten_poops'
  | 'fifty_poops'
  | 'hundred_poops'
  | 'five_hundred_poops'
  | 'thousand_poops'
  | 'all_types'
  | 'all_sizes'
  | 'five_location_tags'
  | 'ten_location_tags'
  | 'foreign_country'
  | 'five_countries'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'streak_100'
  | 'streak_365'
  | 'five_in_one_day'
  | 'ten_in_one_day'
  | 'midnight_pooper'
  | 'early_bird'
  | 'night_owl'
  | 'perfect_ten'
  | 'perfect_fifty'
  | 'perfect_hundred'
  | 'traveler'
  | 'globetrotter'
  | 'explorer'
  | 'commentator'
  | 'novelist'
  | 'weekend_warrior'
  | 'weekday_warrior'
  | 'speedrunner'
  | 'marathon'
  | 'regular'
  | 'destroyer_master'
  | 'tiny_master'
  | 'monday_hater'
  | 'new_year'
  | 'christmas_poop'
  | 'halloween_poop'
  | 'valentine_poop'
  | 'birthday_month'

export interface Trophy {
  id: TrophyId
  name: string
  description: string
  emoji: string
  category: 'quantity' | 'variety' | 'streak' | 'time' | 'location' | 'special' | 'size'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  secret?: boolean
}

export const TROPHIES: Trophy[] = [
  // Quantité
  { id: 'first_poop', name: 'Première fois', description: 'Enregistrer votre premier caca', emoji: '🎉', category: 'quantity', rarity: 'common' },
  { id: 'ten_poops', name: 'Habitué', description: 'Enregistrer 10 cacas', emoji: '🔟', category: 'quantity', rarity: 'common' },
  { id: 'fifty_poops', name: 'Vétéran', description: 'Enregistrer 50 cacas', emoji: '⭐', category: 'quantity', rarity: 'uncommon' },
  { id: 'hundred_poops', name: 'Centurion', description: 'Enregistrer 100 cacas', emoji: '💯', category: 'quantity', rarity: 'rare' },
  { id: 'five_hundred_poops', name: 'Légende vivante', description: 'Enregistrer 500 cacas', emoji: '🏆', category: 'quantity', rarity: 'epic' },
  { id: 'thousand_poops', name: 'Dieu du trône', description: 'Enregistrer 1000 cacas', emoji: '👑', category: 'quantity', rarity: 'legendary' },

  // Variété
  { id: 'all_types', name: 'Collectionneur', description: 'Avoir fait tous les types de caca (1-7)', emoji: '🎨', category: 'variety', rarity: 'rare' },
  { id: 'all_sizes', name: 'Toutes tailles', description: 'Avoir fait toutes les tailles de caca', emoji: '📏', category: 'variety', rarity: 'rare' },
  { id: 'perfect_ten', name: 'Perfectionniste', description: '10 cacas parfaits (Type 4)', emoji: '🐍', category: 'variety', rarity: 'uncommon' },
  { id: 'perfect_fifty', name: 'Maître serpent', description: '50 cacas parfaits (Type 4)', emoji: '🐉', category: 'variety', rarity: 'rare' },
  { id: 'perfect_hundred', name: 'Serpent légendaire', description: '100 cacas parfaits (Type 4)', emoji: '🌟', category: 'variety', rarity: 'epic' },

  // Taille
  { id: 'destroyer_master', name: 'Destructeur', description: '10 cacas "Toilet destroyer"', emoji: '💥', category: 'size', rarity: 'rare' },
  { id: 'tiny_master', name: 'Minimaliste', description: '10 petits cacas', emoji: '🤏', category: 'size', rarity: 'uncommon' },

  // Streak
  { id: 'streak_3', name: 'Flammes !', description: 'Streak de 3 jours', emoji: '🔥', category: 'streak', rarity: 'common' },
  { id: 'streak_7', name: 'Semaine parfaite', description: 'Streak de 7 jours', emoji: '📅', category: 'streak', rarity: 'uncommon' },
  { id: 'streak_14', name: 'Deux semaines', description: 'Streak de 14 jours', emoji: '🗓️', category: 'streak', rarity: 'uncommon' },
  { id: 'streak_30', name: 'Mois complet', description: 'Streak de 30 jours', emoji: '📆', category: 'streak', rarity: 'rare' },
  { id: 'streak_100', name: 'Machine', description: 'Streak de 100 jours', emoji: '🤖', category: 'streak', rarity: 'epic' },
  { id: 'streak_365', name: 'Année parfaite', description: 'Streak de 365 jours', emoji: '🎖️', category: 'streak', rarity: 'legendary' },

  // Temps
  { id: 'five_in_one_day', name: 'Journée chargée', description: '5 cacas en une journée', emoji: '💨', category: 'time', rarity: 'uncommon' },
  { id: 'ten_in_one_day', name: 'Tsunami', description: '10 cacas en une journée', emoji: '🌊', category: 'time', rarity: 'rare' },
  { id: 'midnight_pooper', name: 'Minuit pile', description: 'Caca entre minuit et 1h', emoji: '🌙', category: 'time', rarity: 'uncommon' },
  { id: 'early_bird', name: 'Lève-tôt', description: 'Caca avant 6h du matin', emoji: '🌅', category: 'time', rarity: 'uncommon' },
  { id: 'night_owl', name: 'Noctambule', description: 'Caca après 23h', emoji: '🦉', category: 'time', rarity: 'uncommon' },
  { id: 'speedrunner', name: 'Speedrunner', description: '2 cacas en moins d\'une heure', emoji: '⚡', category: 'time', rarity: 'rare' },
  { id: 'marathon', name: 'Marathon', description: 'Caca chaque heure pendant 5h', emoji: '🏃', category: 'time', rarity: 'epic', secret: true },
  { id: 'regular', name: 'Régulier', description: 'Caca à la même heure (±30min) pendant 7 jours', emoji: '⏰', category: 'time', rarity: 'rare' },
  { id: 'weekend_warrior', name: 'Weekend warrior', description: 'Caca samedi ET dimanche', emoji: '🎮', category: 'time', rarity: 'common' },
  { id: 'weekday_warrior', name: 'Travailleur', description: 'Caca chaque jour de la semaine (lun-ven)', emoji: '💼', category: 'time', rarity: 'uncommon' },
  { id: 'monday_hater', name: 'Lundi difficile', description: '3 cacas un lundi', emoji: '😩', category: 'time', rarity: 'uncommon' },

  // Localisation
  { id: 'five_location_tags', name: 'Cartographe', description: 'Créer 5 tags de lieu', emoji: '📍', category: 'location', rarity: 'uncommon' },
  { id: 'ten_location_tags', name: 'Explorateur', description: 'Créer 10 tags de lieu', emoji: '🗺️', category: 'location', rarity: 'rare' },
  { id: 'foreign_country', name: 'International', description: 'Caca dans un autre pays', emoji: '✈️', category: 'location', rarity: 'rare' },
  { id: 'five_countries', name: 'Globe-trotter', description: 'Caca dans 5 pays différents', emoji: '🌍', category: 'location', rarity: 'epic' },
  { id: 'traveler', name: 'Voyageur', description: '10 lieux différents', emoji: '🧳', category: 'location', rarity: 'uncommon' },
  { id: 'globetrotter', name: 'Nomade', description: '50 lieux différents', emoji: '🌏', category: 'location', rarity: 'rare' },
  { id: 'explorer', name: 'Marco Polo', description: '100 lieux différents', emoji: '🧭', category: 'location', rarity: 'epic' },

  // Spécial
  { id: 'commentator', name: 'Commentateur', description: '10 cacas avec commentaires', emoji: '💬', category: 'special', rarity: 'common' },
  { id: 'novelist', name: 'Romancier', description: '50 cacas avec commentaires', emoji: '📝', category: 'special', rarity: 'uncommon' },
  { id: 'new_year', name: 'Bonne année !', description: 'Caca le 1er janvier', emoji: '🎆', category: 'special', rarity: 'rare' },
  { id: 'christmas_poop', name: 'Cadeau de Noël', description: 'Caca le 25 décembre', emoji: '🎄', category: 'special', rarity: 'rare' },
  { id: 'halloween_poop', name: 'Citrouille', description: 'Caca le 31 octobre', emoji: '🎃', category: 'special', rarity: 'rare' },
  { id: 'valentine_poop', name: 'Caca d\'amour', description: 'Caca le 14 février', emoji: '❤️', category: 'special', rarity: 'rare' },
  { id: 'birthday_month', name: 'Mois spécial', description: 'Caca chaque jour du mois de votre inscription', emoji: '🎂', category: 'special', rarity: 'epic', secret: true },
]

export const TROPHY_CATEGORIES: { value: Trophy['category']; label: string; emoji: string }[] = [
  { value: 'quantity', label: 'Quantité', emoji: '📊' },
  { value: 'variety', label: 'Variété', emoji: '🎨' },
  { value: 'size', label: 'Taille', emoji: '📏' },
  { value: 'streak', label: 'Streak', emoji: '🔥' },
  { value: 'time', label: 'Temps', emoji: '⏰' },
  { value: 'location', label: 'Lieux', emoji: '📍' },
  { value: 'special', label: 'Spécial', emoji: '✨' },
]

export const TROPHY_RARITIES: { value: Trophy['rarity']; label: string; color: string; bgColor: string }[] = [
  { value: 'common', label: 'Commun', color: 'text-zinc-600', bgColor: 'bg-zinc-100 dark:bg-zinc-800' },
  { value: 'uncommon', label: 'Peu commun', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  { value: 'rare', label: 'Rare', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { value: 'epic', label: 'Épique', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { value: 'legendary', label: 'Légendaire', color: 'text-amber-600', bgColor: 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30' },
]

export interface UserTrophy {
  id: string
  user_id: string
  trophy_id: TrophyId
  unlocked_at: string
}

export interface UserTrophyWithProfile extends UserTrophy {
  user_profile?: {
    pseudo: string | null
    avatar_emoji: string
  }
}
