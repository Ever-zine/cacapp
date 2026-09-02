"use client"

import { useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { PoopLog, POOP_TYPES, UserProfile, ACCENT_COLORS, TROPHIES, Trophy, TrophyId, TROPHY_RARITIES, LocationTag } from '@/lib/types'
import AddPoopForm from './AddPoopForm'
import AnalyticsDashboard from './AnalyticsDashboard'
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

const APP_VERSION = '2.2.0'

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

export default function DashboardClient() {
  const [logs, setLogs] = useState<PoopLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState<PoopLog | null>(null)
  const [entryMode, setEntryMode] = useState<'current' | 'backdated'>('current')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'list' | 'analytics' | 'map'>('list')
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
    setEntryMode('current')

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
    setEntryMode('current')

    // Vérifier les nouveaux trophées
    if (user) {
      await checkAndSaveTrophies(newLogs, newStreak, locationTags, userTrophies, user.id)
    }
  }

  const handleEdit = (log: PoopLog) => {
    setEditingLog(log)
    setEntryMode('current')
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingLog(null)
    setEntryMode('current')
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
      <div className="app-page flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-3xl bg-[var(--brand-soft)] text-3xl">💩</div>
          <p className="muted-copy text-sm font-bold">Ouverture de votre journal…</p>
        </div>
      </div>
    )
  }

  const todayCount = logs.filter(log => log.date === new Date().toISOString().split('T')[0]).length
  const perfectCount = logs.filter(log => log.poop_type === 'type4').length

  return (
    <div className="app-page pb-28 md:pb-12" style={{ '--accent': currentColorHex } as React.CSSProperties}>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
        <div className="app-container flex h-[4.5rem] items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2b2119] text-xl shadow-sm">💩</span>
            <div>
              <p className="text-lg font-black leading-none tracking-[-0.045em]">CacApp</p>
              <p className="muted-copy mt-1 hidden text-[11px] font-semibold sm:block">Votre journal du trône</p>
            </div>
          </div>

          <nav className="flex items-center gap-2" aria-label="Navigation du compte">
            <button onClick={() => setShowPatchNotes(true)} className="icon-button hidden sm:inline-flex" title="Voir les nouveautés" aria-label="Voir les nouveautés">✦</button>
            <Link href="/recaps" className="icon-button" title="Récaps mensuels" aria-label="Voir les récaps mensuels">◒</Link>
            <Link href="/trophies" className="relative icon-button" title="Trophées" aria-label={`${userTrophies.length} trophées débloqués`}>
              <span>🏆</span>
              <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[#2b2119] px-1 text-[10px] font-black text-white">{userTrophies.length}</span>
            </Link>
            <button
              onClick={() => setShowProfileSettings(true)}
              className="ml-1 flex h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 pr-1 sm:pr-3"
              title="Modifier le profil"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-xl" style={{ backgroundColor: `${currentColorHex}20`, boxShadow: `inset 0 0 0 1.5px ${currentColorHex}` }}>
                {profile?.avatar_emoji || '💩'}
              </span>
              <span className="hidden max-w-24 truncate text-sm font-extrabold sm:block">{profile?.pseudo || 'Mon profil'}</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="app-container py-6 sm:py-9">
        <div className={activeTab === 'list' ? '' : 'hidden md:block'}>
        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:gap-6">
          <div className="paper-card relative overflow-hidden p-5 sm:p-8">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: currentColorHex }} />
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow mb-3">Aujourd’hui</p>
                  <h1 className="display-title max-w-xl">Bonjour {profile?.pseudo || 'vous'}.</h1>
                  <p className="muted-copy mt-3 max-w-md text-sm leading-6 sm:text-base">Un petit passage à noter, ou simplement envie de voir où vous en êtes&nbsp;?</p>
                </div>
                <button onClick={() => setShowPatchNotes(true)} className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-extrabold sm:hidden">v{APP_VERSION} ✦</button>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  onClick={() => {
                    setEditingLog(null)
                    setEntryMode('current')
                    setShowForm(true)
                  }}
                  className="app-button-primary w-full text-base"
                  style={{ backgroundColor: currentColorHex }}
                >
                  <span className="text-xl">＋</span>
                  Noter un passage
                </button>
                <button
                  onClick={() => {
                    setEditingLog(null)
                    setEntryMode('backdated')
                    setShowForm(true)
                  }}
                  className="app-button-secondary w-full sm:w-auto"
                >
                  <span aria-hidden="true">↶</span> Entrée passée
                </button>
              </div>
            </div>
          </div>

          <div className={`paper-card p-5 sm:p-6 ${streak >= 3 ? 'bg-[linear-gradient(145deg,#fff4e6,#f7dcc6)] dark:bg-[linear-gradient(145deg,#342218,#241d18)]' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Série actuelle</p>
                <p className="text-5xl font-black tracking-[-0.06em]">{streak}<span className="ml-2 text-lg tracking-normal text-[var(--muted)]">jour{streak > 1 ? 's' : ''}</span></p>
              </div>
              <span className={`text-5xl ${streak >= 3 ? 'drop-shadow-md' : 'grayscale opacity-35'}`}>🔥</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all" style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }} />
            </div>
            <p className="muted-copy mt-3 text-xs font-semibold">{streak >= 7 ? 'Semaine complète — superbe régularité.' : `${Math.max(7 - streak, 0)} jour${7 - streak > 1 ? 's' : ''} avant une semaine complète.`}</p>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Résumé de votre activité">
          {[
            { value: logs.length, label: 'Passages', icon: '◎' },
            { value: todayCount, label: 'Aujourd’hui', icon: '◷' },
            { value: perfectCount, label: 'Type 4', icon: '〰' },
            { value: Object.keys(logsByDate).length, label: 'Jours actifs', icon: '▦' },
          ].map(stat => (
            <div key={stat.label} className="paper-card-soft p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">{stat.label}</span>
                <span className="text-lg" style={{ color: currentColorHex }}>{stat.icon}</span>
              </div>
              <p className="text-3xl font-black tracking-[-0.05em]">{stat.value}</p>
            </div>
          ))}
        </section>

        {usersOnStreak.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-[1.5rem] bg-[#2b2119] p-5 text-[#fff8ee] shadow-sm sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#e8a47e]">La communauté chauffe</p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.03em]">Le club des flammes</h2>
              </div>
              <span className="text-3xl">🔥</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {usersOnStreak.map((streakUser, index) => (
                <div key={streakUser.id} className={`flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-2.5 ${streakUser.id === user?.id ? 'border-[#e8a47e] bg-white/10' : 'border-white/10 bg-white/5'}`}>
                  <span className="text-xs font-black text-white/40">{index + 1}</span>
                  <span className="text-xl">{streakUser.avatar_emoji}</span>
                  <div>
                    <p className="max-w-24 truncate text-sm font-bold">{streakUser.pseudo || 'Anonyme'}</p>
                    <p className="text-xs font-black text-[#e8a47e]">{streakUser.streak} jours</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        </div>

        <section className={activeTab === 'list' ? 'mt-8' : 'mt-1 md:mt-8'}>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="md:hidden">
                <p className="eyebrow mb-2">
                  {activeTab === 'list' ? 'Votre journal' : activeTab === 'analytics' ? 'Vos tendances' : 'Exploration'}
                </p>
                <h2 className="text-3xl font-black tracking-[-0.05em]">
                  {activeTab === 'list' ? 'Vos derniers passages' : activeTab === 'analytics' ? 'Analyses' : 'Carte de la communauté'}
                </h2>
                <p className="muted-copy mt-2 text-sm">
                  {activeTab === 'list'
                    ? 'Retrouvez et modifiez votre historique.'
                    : activeTab === 'analytics'
                      ? 'Comprenez votre rythme et vos habitudes.'
                      : 'Explorez les passages géolocalisés.'}
                </p>
              </div>
              <div className="hidden md:block">
                <p className="eyebrow mb-2">Votre journal</p>
                <h2 className="section-title">Tout votre suivi, au même endroit</h2>
              </div>
            </div>
            <button
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                router.push('/login')
              }}
              className="muted-copy hidden text-xs font-bold hover:text-[var(--danger)] sm:block"
            >
              Se déconnecter
            </button>
          </div>

          <div className="mb-6 hidden grid-cols-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm md:grid" role="tablist" aria-label="Vues du journal">
            {([
              ['list', 'Journal', '☷'],
              ['analytics', 'Analyses', '⌁'],
              ['map', 'Carte', '⌖'],
            ] as const).map(([tab, label, icon]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-all ${activeTab === tab ? 'text-white shadow-sm' : 'text-[var(--muted)] hover:bg-[var(--surface-muted)]'}`}
                style={activeTab === tab ? { backgroundColor: currentColorHex } : undefined}
              >
                <span className="text-lg">{icon}</span>{label}
              </button>
            ))}
          </div>

          {activeTab === 'map' && <MapView onEdit={handleEdit} currentUserId={user?.id} />}
          {activeTab === 'analytics' && <AnalyticsDashboard logs={logs} accentHex={currentColorHex} />}
          {activeTab === 'list' && (logs.length === 0 ? (
            <div className="paper-card px-6 py-14 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--brand-soft)] text-4xl">🚽</span>
              <h3 className="mt-5 text-xl font-black tracking-[-0.03em]">Votre journal est encore tout propre</h3>
              <p className="muted-copy mx-auto mt-2 max-w-sm text-sm leading-6">Ajoutez votre premier passage pour commencer à faire apparaître vos habitudes.</p>
              <button onClick={() => setShowForm(true)} className="app-button-primary mt-6" style={{ backgroundColor: currentColorHex }}>Ajouter mon premier passage</button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(logsByDate).map(([date, dateLogs]) => (
                <section key={date}>
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-sm font-black capitalize tracking-[-0.01em]">{formatDate(date)}</h3>
                    <span className="h-px flex-1 bg-[var(--border)]" />
                    <span className="muted-copy text-xs font-bold">{dateLogs.length}</span>
                  </div>
                  <div className="space-y-3">
                    {dateLogs.map(log => {
                      const typeInfo = getPoopTypeInfo(log.poop_type)
                      return (
                        <article key={log.id} className="paper-card group flex items-center gap-3 p-3.5 sm:gap-4 sm:p-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-2xl sm:h-16 sm:w-16 sm:text-3xl">{typeInfo.emoji}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <time className="text-base font-black">{log.time.slice(0, 5)}</time>
                              <span className="muted-copy truncate text-xs font-semibold">• {log.location || 'Lieu non précisé'}</span>
                            </div>
                            <p className="muted-copy mt-1 truncate text-sm"><strong className="font-bold text-[var(--foreground)]">{typeInfo.label}</strong> · {typeInfo.description}</p>
                            {log.comments && <p className="muted-copy mt-1.5 line-clamp-1 text-xs italic">“{log.comments}”</p>}
                          </div>
                          <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                            <button onClick={() => handleEdit(log)} className="icon-button h-10 w-10 border-transparent bg-transparent" title="Modifier" aria-label="Modifier cette entrée">✎</button>
                            <button onClick={() => handleDelete(log.id)} disabled={deleting === log.id} className="icon-button h-10 w-10 border-transparent bg-transparent text-[var(--muted)] hover:text-[var(--danger)] disabled:opacity-50" title="Supprimer" aria-label="Supprimer cette entrée">{deleting === log.id ? '…' : '⌫'}</button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          ))}
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden" aria-label="Vues principales">
        <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_4.25rem_1fr_1fr] items-end">
          {([
            ['list', 'Journal', '☷'],
            ['analytics', 'Stats', '⌁'],
          ] as const).map(([tab, label, icon]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black ${activeTab === tab ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} aria-current={activeTab === tab ? 'page' : undefined}>
              <span className="text-xl leading-none">{icon}</span>{label}
            </button>
          ))}
          <button
            onClick={() => { setEditingLog(null); setEntryMode('current'); setShowForm(true) }}
            className="mx-auto -mt-7 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border-4 border-[var(--surface)] text-3xl font-light text-white shadow-xl"
            style={{ backgroundColor: currentColorHex }}
            aria-label="Noter un nouveau passage"
          >＋</button>
          <button onClick={() => setActiveTab('map')} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black ${activeTab === 'map' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} aria-current={activeTab === 'map' ? 'page' : undefined}>
            <span className="text-xl leading-none">⌖</span>Carte
          </button>
          <button onClick={() => setShowProfileSettings(true)} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black text-[var(--muted)]">
            <span className="text-xl leading-none">◎</span>Profil
          </button>
        </div>
      </nav>

      {showPatchNotes && (
        <div className="app-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="patch-title">
          <div className="app-modal-sheet p-5 sm:p-7">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Nouveautés · v{APP_VERSION}</p>
                <h2 id="patch-title" className="text-3xl font-black tracking-[-0.05em]">CacApp évolue.</h2>
              </div>
              <button onClick={() => setShowPatchNotes(false)} className="icon-button" aria-label="Fermer">×</button>
            </div>
            <div className="space-y-3">
              {[
                { icon: '◒', title: 'Récaps mensuels', copy: 'Revivez chaque mois avec vos chiffres clés, vos moments forts et une image verticale à partager ou télécharger.' },
                { icon: '⌁', title: 'Analyses détaillées', copy: 'Explorez votre rythme, vos types, vos tailles et vos horaires sur 30 jours, 90 jours ou tout votre historique.' },
                { icon: '↶', title: 'Entrées passées', copy: 'Ajoutez un ancien passage avec sa date, son heure et un emplacement choisi directement sur la carte.' },
                { icon: '✦', title: 'Nouvelle interface', copy: 'Profitez d’un design entièrement repensé, plus lisible, plus cohérent et mieux adapté au mobile.' },
              ].map(item => (
                <div key={item.title} className="paper-card-soft flex gap-4 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-xl">{item.icon}</span>
                  <div><h3 className="font-black">{item.title}</h3><p className="muted-copy mt-1 text-sm leading-5">{item.copy}</p></div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPatchNotes(false)} className="app-button-primary mt-6 w-full" style={{ backgroundColor: currentColorHex }}>C’est noté</button>
          </div>
        </div>
      )}

        {showMonthlyRecapPopup && monthlyRecapPrompt && (
          <div className="app-modal-backdrop z-[65]" role="dialog" aria-modal="true" aria-labelledby="recap-popup-title">
            <div className="app-modal-sheet max-w-sm p-6 text-center sm:p-8">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-sky-100 text-4xl dark:bg-sky-950/50">◒</div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-sky-600 dark:text-sky-400">
                  Nouveau récap disponible
                </p>
                <h2 id="recap-popup-title" className="text-3xl font-black capitalize tracking-[-0.05em]">
                  {monthlyRecapPrompt.monthLabel}
                </h2>
                <p className="muted-copy mx-auto mt-3 max-w-xs text-sm leading-6">
                  Votre mois est prêt à être revu avec ses stats, ses moments forts et une image à partager.
                </p>
                <p className="my-6 text-5xl font-black tracking-[-0.05em] text-sky-600 dark:text-sky-400">
                  {monthlyRecapPrompt.total}
                  <span className="muted-copy ml-2 text-sm font-bold tracking-normal">
                    passage{monthlyRecapPrompt.total > 1 ? 's' : ''}
                  </span>
                </p>
                <div className="space-y-3">
                  <button onClick={handleOpenMonthlyRecap} className="app-button-primary w-full bg-sky-600">Voir mon récap</button>
                  <button onClick={markMonthlyRecapPromptSeen} className="app-button-secondary w-full border-transparent">Plus tard</button>
                </div>
            </div>
          </div>
        )}

        {/* Popup déblocage des flammes */}
        {showStreakPopup && (
          <div className="app-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="streak-popup-title">
            <div className="app-modal-sheet max-w-sm p-7 text-center">
                <div className="text-8xl mb-4 animate-pulse">🔥</div>
                <h2 id="streak-popup-title" className="mb-4 text-3xl font-black tracking-[-0.05em] text-orange-500">
                  Flammes débloquées !
                </h2>
                <p className="muted-copy mb-2">
                  Incroyable ! Tu as fait caca pendant
                </p>
                <p className="text-5xl font-bold text-orange-500 mb-2">
                  {streak} jours
                </p>
                <p className="muted-copy mb-6">
                  consécutifs ! Continue comme ça pour maintenir tes flammes 💪
                </p>
                <p className="muted-copy mb-6 text-sm">
                  ⚠️ N&apos;oublie pas : il faut au moins 1 caca par jour pour garder ta streak !
                </p>
                <button
                  onClick={() => setShowStreakPopup(false)}
                  className="app-button-primary w-full bg-gradient-to-r from-orange-500 to-red-500"
                >
                  C&apos;est parti ! 🚀
                </button>
            </div>
          </div>
        )}

        {/* Popup nouveau trophée */}
        {newTrophyPopup && (
          <div className="app-modal-backdrop z-[70]" role="dialog" aria-modal="true">
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
              <div className="rounded-[calc(1.5rem-2px)] bg-[var(--surface)] p-8 text-center">
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

        {showProfileSettings && profile && (
          <div className="app-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="profile-title">
            <div className="app-modal-sheet">
              <div className="p-5 sm:p-7">
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div><p className="eyebrow mb-2">Personnalisation</p><h2 id="profile-title" className="text-2xl font-black tracking-[-0.04em]">Votre profil</h2></div>
                  <button onClick={() => setShowProfileSettings(false)} className="icon-button" aria-label="Fermer">×</button>
                </div>
                <ProfileSettings 
                  profile={profile}
                  onSave={(updatedProfile) => {
                    setProfile(updatedProfile)
                    setShowProfileSettings(false)
                  }}
                  onCancel={() => setShowProfileSettings(false)}
                />
                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    router.push('/login')
                  }}
                  className="mt-5 w-full py-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--danger)] sm:hidden"
                >Se déconnecter</button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="app-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="form-title">
            <div className="app-modal-sheet sm:max-w-2xl">
              <div className="p-5 sm:p-7">
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div><p className="eyebrow mb-2">Votre journal</p><h2 id="form-title" className="text-2xl font-black tracking-[-0.04em]">
                    {editingLog ? 'Modifier l\'entrée' : entryMode === 'backdated' ? 'Ajouter une entrée passée' : 'Nouvelle entrée'}
                  </h2></div>
                  <button onClick={handleCloseForm} className="icon-button" aria-label="Fermer">×</button>
                </div>
                <AddPoopForm 
                  onSuccess={editingLog ? handleLogUpdated : handleLogAdded} 
                  onCancel={handleCloseForm}
                  editLog={editingLog}
                  entryMode={entryMode}
                />
              </div>
            </div>
          </div>
        )}

    </div>
  )
}
