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
