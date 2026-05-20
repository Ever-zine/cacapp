"use client"

import { useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { PoopLog, POOP_TYPES, UserProfile, ACCENT_COLORS, AccentColor, TROPHIES, Trophy, TrophyId, TROPHY_RARITIES, LocationTag } from '@/lib/types'
import AddPoopForm from './AddPoopForm'
import MapView from './MapView'
import ProfileSettings from './ProfileSettings'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'

// Fonction pour calculer le streak (jours consécutifs avec au moins 1 caca)
const calculateStreak = (logs: PoopLog[]): number => {
  if (logs.length === 0) return 0

  // Obtenir les dates uniques triées par ordre décroissant
  const uniqueDates = [...new Set(logs.map(log => log.date))].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  if (uniqueDates.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const mostRecentDate = new Date(uniqueDates[0])
  mostRecentDate.setHours(0, 0, 0, 0)

  // Le streak est cassé si le dernier log n'est pas d'aujourd'hui ou d'hier
  if (mostRecentDate.getTime() < yesterday.getTime()) {
    return 0
  }

  let streak = 1
  let currentDate = mostRecentDate

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i])
    prevDate.setHours(0, 0, 0, 0)
    
    const expectedPrevDate = new Date(currentDate)
    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1)

    if (prevDate.getTime() === expectedPrevDate.getTime()) {
      streak++
      currentDate = prevDate
    } else {
      break
    }
  }

  return streak
}

const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

const formatMonthKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const getPreviousMonthRecapPrompt = (logs: PoopLog[], userId: string) => {
  const now = new Date()
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthKey = formatMonthKey(previousMonth)
  const previousMonthLogs = logs.filter(log => log.date.startsWith(previousMonthKey))

  if (previousMonthLogs.length === 0) return null

  return {
    storageKey: `cacapp-recap-popup-${userId}-${formatMonthKey(now)}`,
    monthLabel: monthFormatter.format(previousMonth),
    total: previousMonthLogs.length,
  }
}

// Fonction pour vérifier les trophées débloqués
const checkTrophies = (
  logs: PoopLog[], 
  streak: number, 
  locationTags: LocationTag[],
  existingTrophies: TrophyId[]
): TrophyId[] => {
  const newTrophies: TrophyId[] = []
  const check = (id: TrophyId, condition: boolean) => {
    if (condition && !existingTrophies.includes(id)) {
      newTrophies.push(id)
    }
  }

  // Quantité
  check('first_poop', logs.length >= 1)
  check('ten_poops', logs.length >= 10)
  check('fifty_poops', logs.length >= 50)
  check('hundred_poops', logs.length >= 100)
  check('five_hundred_poops', logs.length >= 500)
  check('thousand_poops', logs.length >= 1000)

  // Variété - Types
  const uniqueTypes = new Set(logs.map(l => l.poop_type))
  check('all_types', uniqueTypes.size >= 7)

  // Variété - Tailles
  const uniqueSizes = new Set(logs.map(l => l.size))
  check('all_sizes', uniqueSizes.size >= 6)

  // Type parfait
  const perfectCount = logs.filter(l => l.poop_type === 'type4').length
  check('perfect_ten', perfectCount >= 10)
  check('perfect_fifty', perfectCount >= 50)
  check('perfect_hundred', perfectCount >= 100)

  // Taille
  const destroyerCount = logs.filter(l => l.size === 'destroyer').length
  const smallCount = logs.filter(l => l.size === 'small').length
  check('destroyer_master', destroyerCount >= 10)
  check('tiny_master', smallCount >= 10)

  // Streak
  check('streak_3', streak >= 3)
  check('streak_7', streak >= 7)
  check('streak_14', streak >= 14)
  check('streak_30', streak >= 30)
  check('streak_100', streak >= 100)
  check('streak_365', streak >= 365)

  // Location tags
  check('five_location_tags', locationTags.length >= 5)
  check('ten_location_tags', locationTags.length >= 10)

  // Lieux uniques
  const uniqueLocations = new Set(logs.map(l => l.location))
  check('traveler', uniqueLocations.size >= 10)
  check('globetrotter', uniqueLocations.size >= 50)
  check('explorer', uniqueLocations.size >= 100)

  // Pays (basé sur l'adresse)
  const countries = new Set(
    logs
      .filter(l => l.address)
      .map(l => {
        const parts = l.address?.split(',') || []
        return parts[parts.length - 1]?.trim()
      })
      .filter(Boolean)
  )
  check('foreign_country', countries.size >= 2)
  check('five_countries', countries.size >= 5)

  // Temps - cacas par jour
  const logsByDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = []
    acc[log.date].push(log)
    return acc
  }, {} as Record<string, PoopLog[]>)
  
  const maxInOneDay = Math.max(...Object.values(logsByDate).map(l => l.length), 0)
  check('five_in_one_day', maxInOneDay >= 5)
  check('ten_in_one_day', maxInOneDay >= 10)

  // Temps - heures spéciales
  const hasNightLog = logs.some(l => {
    const hour = parseInt(l.time.split(':')[0])
    return hour >= 0 && hour < 1
  })
  check('midnight_pooper', hasNightLog)

  const hasEarlyLog = logs.some(l => {
    const hour = parseInt(l.time.split(':')[0])
    return hour < 6
  })
  check('early_bird', hasEarlyLog)

  const hasLateLog = logs.some(l => {
    const hour = parseInt(l.time.split(':')[0])
    return hour >= 23
  })
  check('night_owl', hasLateLog)

  // Weekend warrior
  const weekendDates = [...new Set(logs.map(l => l.date))].filter(d => {
    const day = new Date(d).getDay()
    return day === 0 || day === 6
  })
  const hasSatAndSun = weekendDates.some(d => new Date(d).getDay() === 6) && 
                       weekendDates.some(d => new Date(d).getDay() === 0)
  check('weekend_warrior', hasSatAndSun)

  // Weekday warrior (lun-ven)
  const weekdayDays = [...new Set(logs.map(l => new Date(l.date).getDay()))].filter(d => d >= 1 && d <= 5)
  check('weekday_warrior', weekdayDays.length >= 5)

  // Monday hater
  const mondayLogs = Object.entries(logsByDate).filter(([date]) => new Date(date).getDay() === 1)
  const hasThreeOnMonday = mondayLogs.some(([, dayLogs]) => dayLogs.length >= 3)
  check('monday_hater', hasThreeOnMonday)

  // Commentaires
  const withComments = logs.filter(l => l.comments && l.comments.trim().length > 0).length
  check('commentator', withComments >= 10)
  check('novelist', withComments >= 50)

  // Dates spéciales
  const dates = logs.map(l => {
    const d = new Date(l.date)
    return { month: d.getMonth() + 1, day: d.getDate() }
  })
  check('new_year', dates.some(d => d.month === 1 && d.day === 1))
  check('christmas_poop', dates.some(d => d.month === 12 && d.day === 25))
  check('halloween_poop', dates.some(d => d.month === 10 && d.day === 31))
  check('valentine_poop', dates.some(d => d.month === 2 && d.day === 14))

  // Speedrunner (2 cacas en moins d'une heure)
  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })
  for (let i = 1; i < sortedLogs.length; i++) {
    const prev = new Date(`${sortedLogs[i-1].date}T${sortedLogs[i-1].time}`)
    const curr = new Date(`${sortedLogs[i].date}T${sortedLogs[i].time}`)
    if (curr.getTime() - prev.getTime() < 60 * 60 * 1000) {
      check('speedrunner', true)
      break
    }
  }

  // Régulier (même heure ±30min pendant 7 jours)
  const timesByDate = Object.entries(logsByDate).map(([date, dayLogs]) => ({
    date,
    times: dayLogs.map(l => {
      const [h, m] = l.time.split(':').map(Number)
      return h * 60 + m
    })
  })).sort((a, b) => a.date.localeCompare(b.date))

  for (let i = 0; i <= timesByDate.length - 7; i++) {
    const week = timesByDate.slice(i, i + 7)
    // Vérifier si les 7 jours sont consécutifs
    let consecutive = true
    for (let j = 1; j < 7; j++) {
      const prevDate = new Date(week[j-1].date)
      const currDate = new Date(week[j].date)
      prevDate.setDate(prevDate.getDate() + 1)
      if (prevDate.toISOString().split('T')[0] !== currDate.toISOString().split('T')[0]) {
        consecutive = false
        break
      }
    }
    if (!consecutive) continue

    // Vérifier si une heure est commune (±30min)
    const firstDayTimes = week[0].times
    for (const baseTime of firstDayTimes) {
      const allMatch = week.every(day => 
        day.times.some(t => Math.abs(t - baseTime) <= 30)
      )
      if (allMatch) {
        check('regular', true)
        break
      }
    }
  }

  return newTrophies
}

// Fonction pour obtenir les classes de couleur dynamiques
const getColorClasses = (color: AccentColor) => {
  const colorMap: Record<AccentColor, { bg: string; hover: string; text: string; gradient: string }> = {
    amber: { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', text: 'text-amber-600', gradient: 'from-amber-50 to-orange-100' },
    red: { bg: 'bg-red-600', hover: 'hover:bg-red-700', text: 'text-red-600', gradient: 'from-red-50 to-rose-100' },
    orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', text: 'text-orange-600', gradient: 'from-orange-50 to-amber-100' },
    yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-yellow-600', gradient: 'from-yellow-50 to-amber-100' },
    lime: { bg: 'bg-lime-600', hover: 'hover:bg-lime-700', text: 'text-lime-600', gradient: 'from-lime-50 to-green-100' },
    green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', text: 'text-green-600', gradient: 'from-green-50 to-emerald-100' },
    emerald: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', gradient: 'from-emerald-50 to-teal-100' },
    teal: { bg: 'bg-teal-600', hover: 'hover:bg-teal-700', text: 'text-teal-600', gradient: 'from-teal-50 to-cyan-100' },
    cyan: { bg: 'bg-cyan-600', hover: 'hover:bg-cyan-700', text: 'text-cyan-600', gradient: 'from-cyan-50 to-sky-100' },
    sky: { bg: 'bg-sky-600', hover: 'hover:bg-sky-700', text: 'text-sky-600', gradient: 'from-sky-50 to-blue-100' },
    blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', gradient: 'from-blue-50 to-indigo-100' },
    indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', gradient: 'from-indigo-50 to-violet-100' },
    violet: { bg: 'bg-violet-600', hover: 'hover:bg-violet-700', text: 'text-violet-600', gradient: 'from-violet-50 to-purple-100' },
    purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', text: 'text-purple-600', gradient: 'from-purple-50 to-fuchsia-100' },
    fuchsia: { bg: 'bg-fuchsia-600', hover: 'hover:bg-fuchsia-700', text: 'text-fuchsia-600', gradient: 'from-fuchsia-50 to-pink-100' },
    pink: { bg: 'bg-pink-600', hover: 'hover:bg-pink-700', text: 'text-pink-600', gradient: 'from-pink-50 to-rose-100' },
    rose: { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-600', gradient: 'from-rose-50 to-red-100' },
  }
  return colorMap[color] || colorMap.amber
}

export default function DashboardClient() {
  const [logs, setLogs] = useState<PoopLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState<PoopLog | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showStreakPopup, setShowStreakPopup] = useState(false)
  const [usersOnStreak, setUsersOnStreak] = useState<{
    id: string
    pseudo: string | null
    avatar_emoji: string
    streak: number
  }[]>([])
  const [userTrophies, setUserTrophies] = useState<TrophyId[]>([])
  const [locationTags, setLocationTags] = useState<LocationTag[]>([])
  const [newTrophyPopup, setNewTrophyPopup] = useState<Trophy | null>(null)
  const [trophyQueue, setTrophyQueue] = useState<Trophy[]>([])
  const [showPatchNotes, setShowPatchNotes] = useState(false)
  const [monthlyRecapPrompt, setMonthlyRecapPrompt] = useState<{
    storageKey: string
    monthLabel: string
    total: number
  } | null>(null)
  const [showMonthlyRecapPopup, setShowMonthlyRecapPopup] = useState(false)

  const accentColor = profile?.accent_color || 'amber'
  const colorClasses = getColorClasses(accentColor)
  const currentColorHex = ACCENT_COLORS.find(c => c.value === accentColor)?.hex || '#f59e0b'

  // Vérifier si on vient de débloquer les flammes
  const checkStreakUnlock = useCallback((newStreak: number, oldStreak: number) => {
    if (newStreak >= 3 && oldStreak < 3) {
      setShowStreakPopup(true)
    }
  }, [])

  // Vérifier et sauvegarder les nouveaux trophées
  const checkAndSaveTrophies = useCallback(async (
    logsToCheck: PoopLog[], 
    currentStreak: number,
    tags: LocationTag[],
    existing: TrophyId[],
    userId: string
  ) => {
    const newlyUnlocked = checkTrophies(logsToCheck, currentStreak, tags, existing)
    
    if (newlyUnlocked.length > 0) {
      const supabase = createClient()
      
      // Sauvegarder les nouveaux trophées
      for (const trophyId of newlyUnlocked) {
        await supabase.from('user_trophies').insert({
          user_id: userId,
          trophy_id: trophyId
        })
      }

      // Mettre à jour l'état local
      setUserTrophies(prev => [...prev, ...newlyUnlocked])

      // Afficher les popups pour les nouveaux trophées
      const trophiesToShow = newlyUnlocked.map(id => TROPHIES.find(t => t.id === id)!).filter(Boolean)
      if (trophiesToShow.length > 0) {
        setTrophyQueue(trophiesToShow)
        setNewTrophyPopup(trophiesToShow[0])
      }
    }
  }, [])

  const handleCloseTrophyPopup = () => {
    setTrophyQueue(prev => {
      const remaining = prev.slice(1)
      if (remaining.length > 0) {
        setNewTrophyPopup(remaining[0])
      } else {
        setNewTrophyPopup(null)
      }
      return remaining
    })
  }

  const handleLogAdded = async (newLog: PoopLog) => {
    const newLogs = [newLog, ...logs]
    setLogs(newLogs)
    const newStreak = calculateStreak(newLogs)
    checkStreakUnlock(newStreak, streak)
    setStreak(newStreak)
    setShowForm(false)
    setEditingLog(null)

    // Vérifier les nouveaux trophées
    if (user) {
      await checkAndSaveTrophies(newLogs, newStreak, locationTags, userTrophies, user.id)
    }
  }

  const handleLogUpdated = async (updatedLog: PoopLog) => {
    const newLogs = logs.map(log => log.id === updatedLog.id ? updatedLog : log)
    setLogs(newLogs)
    const newStreak = calculateStreak(newLogs)
    checkStreakUnlock(newStreak, streak)
    setStreak(newStreak)
    setShowForm(false)
    setEditingLog(null)

    // Vérifier les nouveaux trophées
    if (user) {
      await checkAndSaveTrophies(newLogs, newStreak, locationTags, userTrophies, user.id)
    }
  }

  const handleEdit = (log: PoopLog) => {
    setEditingLog(log)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingLog(null)
  }

  const router = useRouter()

  const markMonthlyRecapPromptSeen = () => {
    if (monthlyRecapPrompt) {
      localStorage.setItem(monthlyRecapPrompt.storageKey, 'seen')
    }
    setShowMonthlyRecapPopup(false)
  }

  const handleOpenMonthlyRecap = () => {
    markMonthlyRecapPromptSeen()
    router.push('/recaps')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette entrée ?')) return

    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('poop_logs').delete().eq('id', id)
    if (!error) {
      setLogs(logs.filter(log => log.id !== id))
    }
    setDeleting(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getPoopTypeInfo = (type: string) => {
    return POOP_TYPES.find(t => t.value === type) || POOP_TYPES[0]
  }

  // Regrouper les logs par date
  const logsByDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = []
    }
    acc[log.date].push(log)
    return acc
  }, {} as Record<string, PoopLog[]>)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      const currentUser = userData?.user ?? null
      if (!currentUser) {
        // not authenticated — redirect to login
        window.location.href = '/login'
        return
      }
      setUser(currentUser)

      // Charger le profil utilisateur (ou le créer s'il n'existe pas)
      let { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (!profileData) {
        // Créer un profil par défaut
        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert({
            user_id: currentUser.id,
            pseudo: null,
            avatar_emoji: '💩',
            accent_color: 'amber'
          })
          .select()
          .single()
        profileData = newProfile
      }

      if (profileData) {
        setProfile(profileData as UserProfile)
      }

      // Charger uniquement les logs de l'utilisateur connecté (pour la liste)
      const { data } = await supabase
        .from('poop_logs')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('date', { ascending: false })
        .order('time', { ascending: false })

      const logsData = (data as PoopLog[]) || []
      setLogs(logsData)
      const initialStreak = calculateStreak(logsData)
      setStreak(initialStreak)

      const recapPrompt = getPreviousMonthRecapPrompt(logsData, currentUser.id)
      if (recapPrompt && localStorage.getItem(recapPrompt.storageKey) !== 'seen') {
        setMonthlyRecapPrompt(recapPrompt)
        setShowMonthlyRecapPopup(true)
      }

      // Charger les location tags de l'utilisateur
      const { data: tagsData } = await supabase
        .from('location_tags')
        .select('*')
        .eq('user_id', currentUser.id)
      
      const tags = (tagsData as LocationTag[]) || []
      setLocationTags(tags)

      // Charger les trophées déjà débloqués par l'utilisateur
      const { data: trophiesData } = await supabase
        .from('user_trophies')
        .select('trophy_id')
        .eq('user_id', currentUser.id)
      
      const existingTrophies = (trophiesData || []).map(t => t.trophy_id as TrophyId)
      setUserTrophies(existingTrophies)

      // Vérifier les nouveaux trophées au chargement
      const newlyUnlocked = checkTrophies(logsData, initialStreak, tags, existingTrophies)
      if (newlyUnlocked.length > 0) {
        for (const trophyId of newlyUnlocked) {
          await supabase.from('user_trophies').insert({
            user_id: currentUser.id,
            trophy_id: trophyId
          })
        }
        setUserTrophies(prev => [...prev, ...newlyUnlocked])
      }

      // Charger tous les logs et profils pour calculer les streaks de tous les utilisateurs
      const { data: allLogs } = await supabase
        .from('poop_logs')
        .select('user_id, date')
        .order('date', { ascending: false })

      const { data: allProfiles } = await supabase
        .from('user_profiles')
        .select('user_id, pseudo, avatar_emoji')

      if (allLogs && allProfiles) {
        // Grouper les logs par user_id
        const logsByUser = (allLogs as { user_id: string; date: string }[]).reduce((acc, log) => {
          if (!acc[log.user_id]) {
            acc[log.user_id] = []
          }
          acc[log.user_id].push({ date: log.date } as PoopLog)
          return acc
        }, {} as Record<string, PoopLog[]>)

        // Calculer le streak pour chaque utilisateur
        const streakUsers = Object.entries(logsByUser)
          .map(([userId, userLogs]) => {
            const userStreak = calculateStreak(userLogs)
            const userProfile = (allProfiles as UserProfile[]).find(p => p.user_id === userId)
            return {
              id: userId,
              pseudo: userProfile?.pseudo || null,
              avatar_emoji: userProfile?.avatar_emoji || '💩',
              streak: userStreak
            }
          })
          .filter(u => u.streak >= 3)
          .sort((a, b) => b.streak - a.streak)

        setUsersOnStreak(streakUsers)
      }

      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Chargement...</div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorClasses.gradient} dark:from-zinc-900 dark:to-zinc-800`}>
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileSettings(true)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110"
              style={{ backgroundColor: `${currentColorHex}20`, border: `2px solid ${currentColorHex}` }}
              title="Modifier le profil"
            >
              {profile?.avatar_emoji || '💩'}
            </button>
            <div>
              <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                {profile?.pseudo || 'CacApp'}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Lien trophées */}
            <Link
              href="/recaps"
              className="flex items-center gap-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 px-3 py-1.5 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
              title="Voir les récaps mensuels"
            >
              <span>📊</span>
              <span className="font-medium text-sm">Récaps</span>
            </Link>

            <Link
              href="/trophies"
              className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
              title="Voir les trophées"
            >
              <span>🏆</span>
              <span className="font-medium text-sm">{userTrophies.length}</span>
            </Link>
            
            <button
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                router.push('/login')
              }}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Banderole Patch Notes */}
        <button
          onClick={() => setShowPatchNotes(true)}
          className="w-full mb-6 py-3 px-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="text-xl">✨</span>
          <span>Nouveautés v2.1 - Récaps mensuels !</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Nouveau</span>
        </button>

        {/* Add button */}
        <button
          onClick={() => setShowForm(true)}
          className={`w-full mb-8 py-4 ${colorClasses.bg} ${colorClasses.hover} text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3`}
        >
          <span className="text-2xl">💩</span>
          <span>Nouvelle commission</span>
        </button>

        {/* Popup Patch Notes */}
        {showPatchNotes && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl shadow-2xl max-w-lg w-full p-1">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl max-h-[85vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center gap-2">
                      ✨ Patch Notes v2.1
                    </h2>
                    <button
                      onClick={() => setShowPatchNotes(false)}
                      className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Version 2.1 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NOUVEAU
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">20 mai 2026</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl p-4">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 mb-2">
                          📊 Récaps mensuels
                        </h3>
                        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 list-disc">
                          <li>Nouvelle page pour revoir tous vos récaps des mois terminés</li>
                          <li>Stats mois par mois : volume, jours actifs, meilleurs créneaux, lieux et types favoris</li>
                          <li>Export en image verticale, prête pour les stories ou les messages</li>
                          <li>Popup mensuelle pour vous inviter à consulter le récap du mois précédent</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Version 2.0 */}
                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-bold px-2 py-1 rounded-full">
                        v2.0
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">25 janvier 2026</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 mb-2">
                          🏆 Système de Trophées
                        </h3>
                        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 list-disc">
                          <li>45 trophées à débloquer</li>
                          <li>5 niveaux de rareté (Commun → Légendaire)</li>
                          <li>7 catégories : Quantité, Variété, Taille, Streak, Temps, Lieux, Spécial</li>
                          <li>Trophées secrets à découvrir</li>
                          <li>Page dédiée pour voir tous les trophées</li>
                          <li>Popup de célébration à chaque déblocage</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 mb-2">
                          🔥 Système de Flammes (Streak)
                        </h3>
                        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 list-disc">
                          <li>Compteur de jours consécutifs</li>
                          <li>Flammes visibles après 3 jours</li>
                          <li>Stat de streak visible sur le dashboard</li>
                          <li>Classement des utilisateurs en streak</li>
                          <li>Popup de célébration au déblocage</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 mb-2">
                          👥 Social
                        </h3>
                        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 list-disc">
                          <li>Liste des utilisateurs en flammes sur l&apos;accueil</li>
                          <li>Voir qui a débloqué chaque trophée</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Version 1.0 */}
                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-bold px-2 py-1 rounded-full">
                        v1.0
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">Lancement</span>
                    </div>
                    <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 list-disc">
                      <li>Enregistrement des cacas avec type et taille</li>
                      <li>Géolocalisation des commissions</li>
                      <li>Carte mondiale des cacas</li>
                      <li>Tags de lieux personnalisés</li>
                      <li>Profil personnalisable (pseudo, emoji, couleur)</li>
                      <li>Statistiques de base</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowPatchNotes(false)}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg"
                  >
                    C&apos;est noté ! 👍
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup récap mensuel */}
        {showMonthlyRecapPopup && monthlyRecapPrompt && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[65] p-4">
            <div className="bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 rounded-3xl shadow-2xl max-w-sm w-full p-1">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-7 text-center">
                <div className="text-7xl mb-4">📊</div>
                <p className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-2">
                  Nouveau récap disponible
                </p>
                <h2 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 mb-3 capitalize">
                  {monthlyRecapPrompt.monthLabel}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mb-2">
                  Votre mois est prêt à être revu avec ses stats, ses moments forts et une image à partager.
                </p>
                <p className="text-4xl font-black text-sky-600 dark:text-sky-400 mb-6">
                  {monthlyRecapPrompt.total}
                  <span className="text-base font-bold text-zinc-500 dark:text-zinc-400 ml-2">
                    passage{monthlyRecapPrompt.total > 1 ? 's' : ''}
                  </span>
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleOpenMonthlyRecap}
                    className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg"
                  >
                    Voir mon récap
                  </button>
                  <button
                    onClick={markMonthlyRecapPromptSeen}
                    className="w-full py-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-medium"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup déblocage des flammes */}
        {showStreakPopup && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-3xl shadow-2xl max-w-sm w-full p-1">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4 animate-pulse">🔥</div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-4">
                  Flammes débloquées !
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mb-2">
                  Incroyable ! Tu as fait caca pendant
                </p>
                <p className="text-5xl font-bold text-orange-500 mb-2">
                  {streak} jours
                </p>
                <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                  consécutifs ! Continue comme ça pour maintenir tes flammes 💪
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                  ⚠️ N&apos;oublie pas : il faut au moins 1 caca par jour pour garder ta streak !
                </p>
                <button
                  onClick={() => setShowStreakPopup(false)}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                >
                  C&apos;est parti ! 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup nouveau trophée */}
        {newTrophyPopup && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4">
            <div className={`rounded-3xl shadow-2xl max-w-sm w-full p-1 ${
              newTrophyPopup.rarity === 'legendary' 
                ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600' 
                : newTrophyPopup.rarity === 'epic'
                ? 'bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600'
                : newTrophyPopup.rarity === 'rare'
                ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600'
                : newTrophyPopup.rarity === 'uncommon'
                ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600'
                : 'bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-600'
            }`}>
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center">
                <div className="text-7xl mb-4">{newTrophyPopup.emoji}</div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                  Nouveau trophée débloqué !
                </p>
                <h2 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 mb-2">
                  {newTrophyPopup.name}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  {newTrophyPopup.description}
                </p>
                <span className={`inline-block text-sm px-3 py-1 rounded-full mb-6 ${
                  TROPHY_RARITIES.find(r => r.value === newTrophyPopup.rarity)?.bgColor
                } ${TROPHY_RARITIES.find(r => r.value === newTrophyPopup.rarity)?.color}`}>
                  {TROPHY_RARITIES.find(r => r.value === newTrophyPopup.rarity)?.label}
                </span>
                {trophyQueue.length > 1 && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                    +{trophyQueue.length - 1} autre{trophyQueue.length > 2 ? 's' : ''} trophée{trophyQueue.length > 2 ? 's' : ''} débloqué{trophyQueue.length > 2 ? 's' : ''}
                  </p>
                )}
                <button
                  onClick={handleCloseTrophyPopup}
                  className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-lg ${
                    newTrophyPopup.rarity === 'legendary'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
                      : newTrophyPopup.rarity === 'epic'
                      ? 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600'
                      : newTrophyPopup.rarity === 'rare'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      : newTrophyPopup.rarity === 'uncommon'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-600 hover:to-zinc-700'
                  }`}
                >
                  {trophyQueue.length > 1 ? 'Suivant →' : 'Super ! 🎉'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Settings modal */}
        {showProfileSettings && profile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    ⚙️ Paramètres du profil
                  </h2>
                  <button
                    onClick={() => setShowProfileSettings(false)}
                    className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    ✕
                  </button>
                </div>
                <ProfileSettings 
                  profile={profile}
                  onSave={(updatedProfile) => {
                    setProfile(updatedProfile)
                    setShowProfileSettings(false)
                  }}
                  onCancel={() => setShowProfileSettings(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {editingLog ? 'Modifier l\'entrée' : 'Nouvelle entrée'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    ✕
                  </button>
                </div>
                <AddPoopForm 
                  onSuccess={editingLog ? handleLogUpdated : handleLogAdded} 
                  onCancel={handleCloseForm}
                  editLog={editingLog}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${colorClasses.text}`}>{logs.length}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${colorClasses.text}`}>
              {logs.filter(l => l.date === new Date().toISOString().split('T')[0]).length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Aujourd&apos;hui</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${colorClasses.text}`}>
              {logs.filter(l => l.poop_type === 'type4').length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Parfaits 🐍</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${colorClasses.text}`}>
              {Object.keys(logsByDate).length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Jours actifs</p>
          </div>
          <div className={`rounded-xl p-4 shadow-sm ${streak >= 3 ? 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30' : 'bg-white dark:bg-zinc-900'}`}>
            <p className={`text-2xl font-bold ${streak >= 3 ? 'text-orange-500' : colorClasses.text}`}>
              {streak >= 3 ? `🔥 ${streak}` : streak}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Streak</p>
          </div>
        </div>

        {/* Utilisateurs en streak */}
        {usersOnStreak.length > 0 && (
          <div className="mb-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔥</span> Utilisateurs en streak
            </h3>
            <div className="flex flex-wrap gap-3">
              {usersOnStreak.map((u) => (
                <div
                  key={u.id}
                  className={`flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-full px-4 py-2 shadow-sm ${
                    u.id === user?.id ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <span className="text-xl">{u.avatar_emoji}</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    {u.pseudo || 'Anonyme'}
                  </span>
                  <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-full">
                    🔥 {u.streak}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'list'
                ? `${colorClasses.bg} text-white shadow-md`
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            📋 Liste
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'map'
                ? `${colorClasses.bg} text-white shadow-md`
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            🗺️ Carte
          </button>
        </div>

        {/* Map View */}
        {activeTab === 'map' && (
          <MapView onEdit={handleEdit} currentUserId={user?.id} />
        )}

        {/* Logs list */}
        {activeTab === 'list' && (logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🚽</p>
            <p className="text-zinc-500 dark:text-zinc-400">
              Aucune entrée pour l&apos;instant.<br />
              Ajoutez votre première commission !
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(logsByDate).map(([date, dateLogs]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 capitalize">
                  {formatDate(date)}
                </h3>
                <div className="space-y-3">
                  {dateLogs.map((log) => {
                    const typeInfo = getPoopTypeInfo(log.poop_type)
                    return (
                      <div
                        key={log.id}
                        className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm flex items-start gap-4"
                      >
                        <div className="text-3xl">{typeInfo.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-zinc-800 dark:text-zinc-100">
                              {log.time.slice(0, 5)}
                            </span>
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                              📍 {log.location}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                            {typeInfo.label} - {typeInfo.description}
                          </p>
                          {log.comments && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 italic">
                              &quot;{log.comments}&quot;
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(log)}
                            className="text-zinc-400 hover:text-amber-500 transition-colors"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(log.id)}
                            disabled={deleting === log.id}
                            className="text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Supprimer"
                          >
                            {deleting === log.id ? '...' : '🗑️'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}
