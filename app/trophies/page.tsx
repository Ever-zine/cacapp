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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <p className="text-zinc-600 dark:text-zinc-400">Chargement des trophées...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-2">
            ← Retour
          </Link>
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            🏆 Trophées
          </h1>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {unlockedCount}/{totalCount}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Votre progression</h2>
            <span className="text-2xl font-bold text-amber-600">{Math.round((unlockedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            {unlockedCount} trophée{unlockedCount > 1 ? 's' : ''} débloqué{unlockedCount > 1 ? 's' : ''} sur {totalCount}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            Tous
          </button>
          {TROPHY_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === cat.value
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Trophies grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTrophies.map(trophy => {
            const isUnlocked = userTrophies.includes(trophy.id)
            const rarityInfo = getRarityInfo(trophy.rarity)
            const isSecret = trophy.secret && !isUnlocked

            return (
              <button
                key={trophy.id}
                onClick={() => setSelectedTrophy(trophy)}
                className={`p-4 rounded-2xl text-left transition-all hover:scale-[1.02] ${
                  isUnlocked 
                    ? `${rarityInfo.bgColor} shadow-md` 
                    : 'bg-white/50 dark:bg-zinc-900/50'
                }`}
              >
                <div className={`text-4xl mb-2 ${!isUnlocked && !isSecret ? 'grayscale opacity-50' : ''}`}>
                  {isSecret ? '❓' : trophy.emoji}
                </div>
                <h3 className={`font-bold text-sm ${isUnlocked ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}`}>
                  {isSecret ? '???' : trophy.name}
                </h3>
                <p className={`text-xs mt-1 ${isUnlocked ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
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

      {/* Trophy detail modal */}
      {selectedTrophy && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTrophy(null)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`text-6xl mb-4 ${
                  !userTrophies.includes(selectedTrophy.id) && !selectedTrophy.secret ? 'grayscale opacity-50' : ''
                }`}>
                  {selectedTrophy.secret && !userTrophies.includes(selectedTrophy.id) ? '❓' : selectedTrophy.emoji}
                </div>
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                  {selectedTrophy.secret && !userTrophies.includes(selectedTrophy.id) ? '???' : selectedTrophy.name}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  {selectedTrophy.secret && !userTrophies.includes(selectedTrophy.id) ? 'Trophée secret - Continuez à jouer pour le découvrir !' : selectedTrophy.description}
                </p>
                <span className={`inline-block mt-3 text-sm px-3 py-1 rounded-full ${getRarityInfo(selectedTrophy.rarity).bgColor} ${getRarityInfo(selectedTrophy.rarity).color}`}>
                  {getRarityInfo(selectedTrophy.rarity).label}
                </span>
              </div>

              {/* Users who unlocked */}
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 mb-3">
                  Débloqué par ({selectedTrophy.unlockedBy.length})
                </h3>
                {selectedTrophy.unlockedBy.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
                    Personne n'a encore débloqué ce trophée.<br />
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

              <button
                onClick={() => setSelectedTrophy(null)}
                className="w-full mt-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
