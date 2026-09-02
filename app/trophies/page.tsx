"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  TROPHIES, 
  TROPHY_CATEGORIES, 
  TROPHY_RARITIES, 
  Trophy, 
  TrophyId,
  UserTrophy,
  UserProfile 
} from '@/lib/types'
import Link from 'next/link'

interface TrophyWithUsers extends Trophy {
  unlockedBy: {
    user_id: string
    pseudo: string | null
    avatar_emoji: string
    unlocked_at: string
  }[]
}

export default function TrophiesPage() {
  const [trophiesWithUsers, setTrophiesWithUsers] = useState<TrophyWithUsers[]>([])
  const [userTrophies, setUserTrophies] = useState<TrophyId[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Trophy['category'] | 'all'>('all')
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyWithUsers | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        window.location.href = '/login'
        return
      }
      setCurrentUserId(userData.user.id)

      // Charger tous les trophées débloqués avec les profils
      const { data: allUserTrophies } = await supabase
        .from('user_trophies')
        .select('*')
        .order('unlocked_at', { ascending: false })

      const { data: allProfiles } = await supabase
        .from('user_profiles')
        .select('user_id, pseudo, avatar_emoji')

      // Construire la liste des trophées avec les utilisateurs qui les ont débloqués
      const trophiesData: TrophyWithUsers[] = TROPHIES.map(trophy => {
        const unlockedBy = (allUserTrophies as UserTrophy[] || [])
          .filter(ut => ut.trophy_id === trophy.id)
          .map(ut => {
            const profile = (allProfiles as UserProfile[] || []).find(p => p.user_id === ut.user_id)
            return {
              user_id: ut.user_id,
              pseudo: profile?.pseudo || null,
              avatar_emoji: profile?.avatar_emoji || '💩',
              unlocked_at: ut.unlocked_at
            }
          })
        
        return {
          ...trophy,
          unlockedBy
        }
      })

      setTrophiesWithUsers(trophiesData)

      // Trophées de l'utilisateur courant
      const currentUserTrophies = (allUserTrophies as UserTrophy[] || [])
        .filter(ut => ut.user_id === userData.user.id)
        .map(ut => ut.trophy_id as TrophyId)
      
      setUserTrophies(currentUserTrophies)
      setLoading(false)
    }

    load()
  }, [])

  const filteredTrophies = selectedCategory === 'all' 
    ? trophiesWithUsers 
    : trophiesWithUsers.filter(t => t.category === selectedCategory)

  const getRarityInfo = (rarity: Trophy['rarity']) => {
    return TROPHY_RARITIES.find(r => r.value === rarity) || TROPHY_RARITIES[0]
  }

  const unlockedCount = userTrophies.length
  const totalCount = TROPHIES.filter(t => !t.secret).length

  if (loading) {
    return (
      <div className="app-page flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-3xl bg-[var(--brand-soft)] text-3xl">🏆</div>
          <p className="muted-copy text-sm font-bold">Ouverture de la vitrine…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
        <div className="app-container flex h-[4.5rem] items-center justify-between">
          <Link href="/dashboard" className="app-button-secondary min-h-10 rounded-full px-3 text-sm">
            ← <span className="hidden sm:inline">Retour</span>
          </Link>
          <h1 className="flex items-center gap-2 text-lg font-black tracking-[-0.04em]">
            <span>🏆</span> Trophées
          </h1>
          <div className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-black text-[var(--brand)]">
            {unlockedCount}/{totalCount}
          </div>
        </div>
      </header>

      <main className="app-container py-7 sm:py-10">
        <section className="mb-8 overflow-hidden rounded-[1.75rem] bg-[#2b2119] p-6 text-[#fff8ee] shadow-lg sm:p-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#e8a47e]">Votre collection</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">{unlockedCount} exploits accomplis.</h2></div>
            <span className="text-3xl font-black text-[#e8a47e]">{Math.round((unlockedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#e8a47e] to-[#f2c48e] transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-white/55">
            Encore {Math.max(totalCount - unlockedCount, 0)} trophée{totalCount - unlockedCount > 1 ? 's' : ''} visible{totalCount - unlockedCount > 1 ? 's' : ''} à décrocher
          </p>
        </section>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`min-h-11 whitespace-nowrap rounded-full border px-4 text-sm font-black transition-all ${
              selectedCategory === 'all'
                ? 'border-[#2b2119] bg-[#2b2119] text-white shadow-md'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
            }`}
          >
            Tous
          </button>
          {TROPHY_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex min-h-11 items-center gap-1 whitespace-nowrap rounded-full border px-4 text-sm font-black transition-all ${
                selectedCategory === cat.value
                  ? 'border-[#2b2119] bg-[#2b2119] text-white shadow-md'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {filteredTrophies.map(trophy => {
            const isUnlocked = userTrophies.includes(trophy.id)
            const rarityInfo = getRarityInfo(trophy.rarity)
            const isSecret = trophy.secret && !isUnlocked

            return (
              <button
                key={trophy.id}
                onClick={() => setSelectedTrophy(trophy)}
                className={`min-h-48 rounded-3xl border p-4 text-left transition-all hover:-translate-y-0.5 sm:p-5 ${
                  isUnlocked 
                    ? `${rarityInfo.bgColor} border-transparent shadow-sm` 
                    : 'border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_58%,transparent)]'
                }`}
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/55 text-3xl shadow-sm dark:bg-black/15 ${!isUnlocked && !isSecret ? 'grayscale opacity-45' : ''}`}>
                  {isSecret ? '❓' : trophy.emoji}
                </div>
                <h3 className={`text-sm font-black ${isUnlocked ? 'text-zinc-800 dark:text-zinc-100' : 'text-[var(--muted)] opacity-60'}`}>
                  {isSecret ? '???' : trophy.name}
                </h3>
                <p className={`mt-1 text-xs leading-4 ${isUnlocked ? 'text-zinc-600 dark:text-zinc-400' : 'text-[var(--muted)] opacity-50'}`}>
                  {isSecret ? 'Trophée secret' : trophy.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rarityInfo.bgColor} ${rarityInfo.color}`}>
                    {rarityInfo.label}
                  </span>
                  {trophy.unlockedBy.length > 0 && (
                    <div className="flex -space-x-1">
                      {trophy.unlockedBy.slice(0, 3).map((u, i) => (
                        <span 
                          key={i} 
                          className={`w-5 h-5 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-xs border-2 ${
                            u.user_id === currentUserId ? 'border-amber-500' : 'border-white dark:border-zinc-800'
                          }`}
                        >
                          {u.avatar_emoji}
                        </span>
                      ))}
                      {trophy.unlockedBy.length > 3 && (
                        <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-600 dark:text-zinc-400">
                          +{trophy.unlockedBy.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </main>

      {selectedTrophy && (
        <div 
          className="app-modal-backdrop"
          onClick={() => setSelectedTrophy(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="app-modal-sheet max-w-md p-6 sm:p-8"
            onClick={e => e.stopPropagation()}
          >
              <div className="text-center mb-6">
                <div className={`text-6xl mb-4 ${
                  !userTrophies.includes(selectedTrophy.id) && !selectedTrophy.secret ? 'grayscale opacity-50' : ''
                }`}>
                  {selectedTrophy.secret && !userTrophies.includes(selectedTrophy.id) ? '❓' : selectedTrophy.emoji}
                </div>
                <h2 className="text-2xl font-black tracking-[-0.04em]">
                  {selectedTrophy.secret && !userTrophies.includes(selectedTrophy.id) ? '???' : selectedTrophy.name}
                </h2>
                <p className="muted-copy mt-2 text-sm leading-6">
                  {selectedTrophy.secret && !userTrophies.includes(selectedTrophy.id) ? 'Trophée secret - Continuez à jouer pour le découvrir !' : selectedTrophy.description}
                </p>
                <span className={`inline-block mt-3 text-sm px-3 py-1 rounded-full ${getRarityInfo(selectedTrophy.rarity).bgColor} ${getRarityInfo(selectedTrophy.rarity).color}`}>
                  {getRarityInfo(selectedTrophy.rarity).label}
                </span>
              </div>

              {/* Users who unlocked */}
              <div className="border-t border-[var(--border)] pt-4">
                <h3 className="mb-3 font-black">
                  Débloqué par ({selectedTrophy.unlockedBy.length})
                </h3>
                {selectedTrophy.unlockedBy.length === 0 ? (
                  <p className="muted-copy py-4 text-center text-sm">
                    Personne n&apos;a encore débloqué ce trophée.<br />
                    Soyez le premier ! 🏆
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedTrophy.unlockedBy.map((u, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          u.user_id === currentUserId ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-zinc-50 dark:bg-zinc-800'
                        }`}
                      >
                        <span className="text-2xl">{u.avatar_emoji}</span>
                        <div className="flex-1">
                          <p className="font-medium text-zinc-800 dark:text-zinc-100">
                            {u.pseudo || 'Anonyme'}
                            {u.user_id === currentUserId && <span className="text-amber-600 ml-2">(vous)</span>}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(u.unlocked_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => setSelectedTrophy(null)} className="app-button-secondary mt-6 w-full">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}
