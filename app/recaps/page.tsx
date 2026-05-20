"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ACCENT_COLORS, AccentColor, LocationTag, POOP_SIZES, POOP_TYPES, PoopLog, UserProfile } from '@/lib/types'

type MonthlyRecap = {
  monthKey: string
  monthLabel: string
  shortLabel: string
  logs: PoopLog[]
  total: number
  activeDays: number
  averagePerActiveDay: number
  perfectCount: number
  perfectRate: number
  topType: typeof POOP_TYPES[number] | null
  topSize: typeof POOP_SIZES[number] | null
  topLocation: string | null
  bestDay: { date: string; count: number } | null
  favoriteHour: string | null
  locationTagsUsedCount: number
  locationTagsTotal: number
  longestStreak: number
  previousMonthDelta: number | null
}

const getColorHex = (color: AccentColor) => ACCENT_COLORS.find(c => c.value === color)?.hex || '#f59e0b'

const getColorClasses = (color: AccentColor) => {
  const colorMap: Record<AccentColor, { bg: string; hover: string; text: string; border: string; ring: string; gradient: string }> = {
    amber: { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', text: 'text-amber-600', border: 'border-amber-200 dark:border-amber-900/50', ring: 'ring-amber-500', gradient: 'from-amber-50 to-orange-100' },
    red: { bg: 'bg-red-600', hover: 'hover:bg-red-700', text: 'text-red-600', border: 'border-red-200 dark:border-red-900/50', ring: 'ring-red-500', gradient: 'from-red-50 to-rose-100' },
    orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', text: 'text-orange-600', border: 'border-orange-200 dark:border-orange-900/50', ring: 'ring-orange-500', gradient: 'from-orange-50 to-amber-100' },
    yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-yellow-600', border: 'border-yellow-200 dark:border-yellow-900/50', ring: 'ring-yellow-500', gradient: 'from-yellow-50 to-amber-100' },
    lime: { bg: 'bg-lime-600', hover: 'hover:bg-lime-700', text: 'text-lime-600', border: 'border-lime-200 dark:border-lime-900/50', ring: 'ring-lime-500', gradient: 'from-lime-50 to-green-100' },
    green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', text: 'text-green-600', border: 'border-green-200 dark:border-green-900/50', ring: 'ring-green-500', gradient: 'from-green-50 to-emerald-100' },
    emerald: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-900/50', ring: 'ring-emerald-500', gradient: 'from-emerald-50 to-teal-100' },
    teal: { bg: 'bg-teal-600', hover: 'hover:bg-teal-700', text: 'text-teal-600', border: 'border-teal-200 dark:border-teal-900/50', ring: 'ring-teal-500', gradient: 'from-teal-50 to-cyan-100' },
    cyan: { bg: 'bg-cyan-600', hover: 'hover:bg-cyan-700', text: 'text-cyan-600', border: 'border-cyan-200 dark:border-cyan-900/50', ring: 'ring-cyan-500', gradient: 'from-cyan-50 to-sky-100' },
    sky: { bg: 'bg-sky-600', hover: 'hover:bg-sky-700', text: 'text-sky-600', border: 'border-sky-200 dark:border-sky-900/50', ring: 'ring-sky-500', gradient: 'from-sky-50 to-blue-100' },
    blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', border: 'border-blue-200 dark:border-blue-900/50', ring: 'ring-blue-500', gradient: 'from-blue-50 to-indigo-100' },
    indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', border: 'border-indigo-200 dark:border-indigo-900/50', ring: 'ring-indigo-500', gradient: 'from-indigo-50 to-violet-100' },
    violet: { bg: 'bg-violet-600', hover: 'hover:bg-violet-700', text: 'text-violet-600', border: 'border-violet-200 dark:border-violet-900/50', ring: 'ring-violet-500', gradient: 'from-violet-50 to-purple-100' },
    purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', text: 'text-purple-600', border: 'border-purple-200 dark:border-purple-900/50', ring: 'ring-purple-500', gradient: 'from-purple-50 to-fuchsia-100' },
    fuchsia: { bg: 'bg-fuchsia-600', hover: 'hover:bg-fuchsia-700', text: 'text-fuchsia-600', border: 'border-fuchsia-200 dark:border-fuchsia-900/50', ring: 'ring-fuchsia-500', gradient: 'from-fuchsia-50 to-pink-100' },
    pink: { bg: 'bg-pink-600', hover: 'hover:bg-pink-700', text: 'text-pink-600', border: 'border-pink-200 dark:border-pink-900/50', ring: 'ring-pink-500', gradient: 'from-pink-50 to-rose-100' },
    rose: { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-600', border: 'border-rose-200 dark:border-rose-900/50', ring: 'ring-rose-500', gradient: 'from-rose-50 to-red-100' },
  }
  return colorMap[color] || colorMap.amber
}

const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const shortMonthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' })
const dayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric' })

const getMonthKey = (date: string) => date.slice(0, 7)

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatMonthKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const getCurrentMonthKey = () => formatMonthKey(new Date())

const getTopEntry = <T extends string>(items: T[]): { value: T; count: number } | null => {
  const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {} as Record<T, number>)

  const [value, count] = Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]))[0] || []
  return value ? { value: value as T, count: Number(count) } : null
}

const calculateLongestStreak = (logs: PoopLog[]) => {
  const uniqueDates = [...new Set(logs.map(log => log.date))].sort()
  if (uniqueDates.length === 0) return 0

  let current = 1
  let longest = 1

  for (let i = 1; i < uniqueDates.length; i++) {
    const previous = new Date(`${uniqueDates[i - 1]}T00:00:00`)
    previous.setDate(previous.getDate() + 1)
    const expected = formatDateKey(previous)

    if (uniqueDates[i] === expected) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return longest
}

const buildMonthlyRecaps = (logs: PoopLog[], locationTags: LocationTag[]): MonthlyRecap[] => {
  const byMonth = logs.reduce((acc, log) => {
    const monthKey = getMonthKey(log.date)
    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(log)
    return acc
  }, {} as Record<string, PoopLog[]>)

  const currentMonthKey = getCurrentMonthKey()
  const locationTagNames = new Set(locationTags.map(tag => tag.name))
  const monthKeys = Object.keys(byMonth)
    .filter(monthKey => monthKey < currentMonthKey)
    .sort((a, b) => b.localeCompare(a))

  return monthKeys.map(monthKey => {
    const monthLogs = byMonth[monthKey].sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))
    const previousMonth = new Date(`${monthKey}-01T00:00:00`)
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const previousMonthKey = formatMonthKey(previousMonth)
    const previousTotal = byMonth[previousMonthKey]?.length ?? null
    const topType = getTopEntry(monthLogs.map(log => log.poop_type))
    const topSize = getTopEntry(monthLogs.map(log => log.size))
    const topLocation = getTopEntry(monthLogs.map(log => log.location))
    const topHour = getTopEntry(monthLogs.map(log => log.time.slice(0, 2)))
    const usedLocationTags = new Set(monthLogs.map(log => log.location).filter(location => locationTagNames.has(location)))
    const logsByDate = monthLogs.reduce((acc, log) => {
      acc[log.date] = (acc[log.date] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const [bestDayDate, bestDayCount] = Object.entries(logsByDate).sort((a, b) => b[1] - a[1])[0] || []
    const perfectCount = monthLogs.filter(log => log.poop_type === 'type4').length
    const monthDate = new Date(`${monthKey}-01T00:00:00`)

    return {
      monthKey,
      monthLabel: monthFormatter.format(monthDate),
      shortLabel: shortMonthFormatter.format(monthDate),
      logs: monthLogs,
      total: monthLogs.length,
      activeDays: Object.keys(logsByDate).length,
      averagePerActiveDay: monthLogs.length / Math.max(Object.keys(logsByDate).length, 1),
      perfectCount,
      perfectRate: Math.round((perfectCount / Math.max(monthLogs.length, 1)) * 100),
      topType: topType ? POOP_TYPES.find(type => type.value === topType.value) || null : null,
      topSize: topSize ? POOP_SIZES.find(size => size.value === topSize.value) || null : null,
      topLocation: topLocation?.value || null,
      bestDay: bestDayDate ? { date: bestDayDate, count: Number(bestDayCount) } : null,
      favoriteHour: topHour ? `${topHour.value}h-${String(Number(topHour.value) + 1).padStart(2, '0')}h` : null,
      locationTagsUsedCount: usedLocationTags.size,
      locationTagsTotal: locationTags.length,
      longestStreak: calculateLongestStreak(monthLogs),
      previousMonthDelta: previousTotal === null ? null : monthLogs.length - previousTotal,
    }
  })
}

const drawWrappedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(' ')
  let line = ''
  let currentY = y

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = word
      currentY += lineHeight
    } else {
      line = testLine
    }
  }

  if (line) ctx.fillText(line, x, currentY)
}

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

const drawRecapImage = (recap: MonthlyRecap, profile: UserProfile | null, accentHex: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920)
  gradient.addColorStop(0, '#18181b')
  gradient.addColorStop(0.45, accentHex)
  gradient.addColorStop(1, '#f97316')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1080, 1920)

  ctx.globalAlpha = 0.14
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    ctx.arc(90 + i * 105, 220 + (i % 3) * 190, 82, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  ctx.fillStyle = 'rgba(255,255,255,0.16)'
  roundedRect(ctx, 72, 74, 936, 1772, 56)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.32)'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 34px Arial'
  ctx.fillText('CacApp Monthly Recap', 120, 160)
  ctx.font = '900 86px Arial'
  drawWrappedText(ctx, recap.monthLabel.toUpperCase(), 120, 290, 840, 92)

  ctx.font = '700 40px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.86)'
  const name = profile?.pseudo || 'Anonyme'
  ctx.fillText(`${profile?.avatar_emoji || '💩'} ${name}`, 120, 420)

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 240px Arial'
  ctx.fillText(String(recap.total), 120, 680)
  ctx.font = '800 52px Arial'
  ctx.fillText(recap.total > 1 ? 'passages aux toilettes' : 'passage aux toilettes', 128, 760)

  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.font = '600 34px Arial'
  const deltaText = recap.previousMonthDelta === null
    ? 'Premier mois enregistré'
    : recap.previousMonthDelta === 0
      ? 'Autant que le mois précédent'
      : `${recap.previousMonthDelta > 0 ? '+' : ''}${recap.previousMonthDelta} vs mois précédent`
  ctx.fillText(deltaText, 128, 820)

  const tiles = [
    { label: 'Jours actifs', value: String(recap.activeDays), detail: `${recap.averagePerActiveDay.toFixed(1).replace('.', ',')} par jour actif` },
    { label: 'Cacas parfaits', value: `${recap.perfectRate}%`, detail: `${recap.perfectCount} type 4` },
    { label: 'Meilleure heure', value: recap.favoriteHour || '--', detail: 'créneau favori' },
    { label: 'Plus longue série', value: `${recap.longestStreak}j`, detail: 'dans le mois' },
  ]

  tiles.forEach((tile, index) => {
    const x = 120 + (index % 2) * 420
    const y = 940 + Math.floor(index / 2) * 260
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    roundedRect(ctx, x, y, 370, 205, 32)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 66px Arial'
    ctx.fillText(tile.value, x + 34, y + 88)
    ctx.font = '700 28px Arial'
    ctx.fillText(tile.label, x + 34, y + 136)
    ctx.font = '500 24px Arial'
    ctx.fillStyle = 'rgba(255,255,255,0.74)'
    ctx.fillText(tile.detail, x + 34, y + 170)
  })

  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  roundedRect(ctx, 120, 1510, 840, 188, 36)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 34px Arial'
  drawWrappedText(ctx, `Top lieu : ${recap.topLocation || 'pas encore de lieu favori'}`, 158, 1580, 760, 42)
  ctx.font = '700 30px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.78)'
  const bestDayText = recap.bestDay
    ? `${dayFormatter.format(new Date(`${recap.bestDay.date}T00:00:00`))} : ${recap.bestDay.count} passage${recap.bestDay.count > 1 ? 's' : ''}`
    : 'Aucune journée active'
  drawWrappedText(ctx, `Pic du mois : ${bestDayText}`, 158, 1662, 760, 38)

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 32px Arial'
  ctx.fillText('cacapp.app', 120, 1780)
  ctx.font = '500 26px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.72)'
  ctx.fillText('fait avec amour et beaucoup de sincérité digestive', 120, 1824)

  return canvas
}

export default function RecapsPage() {
  const [logs, setLogs] = useState<PoopLog[]>([])
  const [locationTags, setLocationTags] = useState<LocationTag[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const accentColor = profile?.accent_color || 'amber'
  const colorClasses = getColorClasses(accentColor)
  const accentHex = getColorHex(accentColor)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        window.location.href = '/login'
        return
      }

      const [{ data: logsData }, { data: profileData }, { data: tagsData }] = await Promise.all([
        supabase
          .from('poop_logs')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('date', { ascending: false })
          .order('time', { ascending: false }),
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userData.user.id)
          .single(),
        supabase
          .from('location_tags')
          .select('*')
          .eq('user_id', userData.user.id),
      ])

      const userLogs = (logsData as PoopLog[]) || []
      setLogs(userLogs)
      setLocationTags((tagsData as LocationTag[]) || [])
      setProfile((profileData as UserProfile) || null)
      setLoading(false)
    }

    load()
  }, [])

  const recaps = useMemo(() => buildMonthlyRecaps(logs, locationTags), [logs, locationTags])
  const selectedRecap = recaps.find(recap => recap.monthKey === selectedMonth) || recaps[0] || null
  const recappedLogsCount = useMemo(() => recaps.reduce((total, recap) => total + recap.total, 0), [recaps])

  const exportImage = async (share = false) => {
    if (!selectedRecap) return
    setExporting(true)
    setShareMessage(null)

    try {
      const canvas = drawRecapImage(selectedRecap, profile, accentHex)
      if (!canvas) throw new Error('Impossible de générer le récap')

      const fileName = `cacapp-recap-${selectedRecap.monthKey}.png`
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.96))
      if (!blob) throw new Error('Impossible de créer l’image')

      const file = new File([blob], fileName, { type: 'image/png' })

      if (share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Mon récap CacApp ${selectedRecap.monthLabel}`,
          text: `Mon récap caca de ${selectedRecap.monthLabel}`,
        })
        setShareMessage('Récap prêt à partager.')
      } else {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)
        setShareMessage(share ? 'Partage natif indisponible ici, image téléchargée.' : 'Image exportée.')
      }
    } catch (error) {
      setShareMessage(error instanceof Error ? error.message : 'Export impossible pour le moment.')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${colorClasses.gradient} dark:from-zinc-900 dark:to-zinc-800`}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <p className="text-zinc-600 dark:text-zinc-400">Préparation des récaps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorClasses.gradient} dark:from-zinc-900 dark:to-zinc-800`}>
      <header className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-2">
            ← Retour
          </Link>
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            📊 Récaps mensuels
          </h1>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {recaps.length} mois
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {recaps.length === 0 || !selectedRecap ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm text-center">
            <p className="text-6xl mb-4">🚽</p>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Aucun récap pour le moment</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Les récaps apparaissent uniquement une fois le mois terminé.</p>
            <Link
              href="/dashboard"
              className={`inline-flex items-center justify-center px-5 py-3 rounded-xl text-white font-semibold ${colorClasses.bg} ${colorClasses.hover}`}
            >
              Ajouter une commission
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
            <aside className="bg-white/80 dark:bg-zinc-900/90 rounded-2xl p-4 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-zinc-800 dark:text-zinc-100">Tous les mois</h2>
                <span className={`text-sm font-bold ${colorClasses.text}`}>{recappedLogsCount}</span>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {recaps.map(recap => (
                  <button
                    key={recap.monthKey}
                    onClick={() => setSelectedMonth(recap.monthKey)}
                    className={`w-full text-left rounded-xl p-3 border transition-all ${
                      selectedRecap.monthKey === recap.monthKey
                        ? `bg-white dark:bg-zinc-800 border-transparent ring-2 ${colorClasses.ring} shadow-md`
                        : `bg-zinc-50 dark:bg-zinc-800/70 ${colorClasses.border} hover:bg-white dark:hover:bg-zinc-800`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-100 capitalize">{recap.shortLabel}</span>
                      <span className={`font-bold ${colorClasses.text}`}>{recap.total}</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {recap.activeDays} jour{recap.activeDays > 1 ? 's' : ''} actif{recap.activeDays > 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="space-y-6">
              <div
                className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl text-white"
                style={{
                  background: `linear-gradient(135deg, #18181b 0%, ${accentHex} 48%, #f97316 100%)`,
                }}
              >
                <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10" />
                <div className="absolute top-36 -left-20 w-56 h-56 rounded-full bg-white/10" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-10">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-white/70 font-bold">CacApp Monthly Recap</p>
                      <h2 className="text-4xl sm:text-6xl font-black mt-2 capitalize leading-tight">{selectedRecap.monthLabel}</h2>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-lg">
                      {profile?.avatar_emoji || '💩'}
                    </div>
                  </div>

                  <div className="mb-10">
                    <p className="text-[7rem] sm:text-[10rem] leading-none font-black tracking-normal">{selectedRecap.total}</p>
                    <p className="text-2xl sm:text-3xl font-extrabold">
                      passage{selectedRecap.total > 1 ? 's' : ''} aux toilettes
                    </p>
                    <p className="text-white/75 mt-3">
                      {selectedRecap.previousMonthDelta === null
                        ? 'Premier mois enregistré dans CacApp.'
                        : selectedRecap.previousMonthDelta === 0
                          ? 'Même cadence que le mois précédent.'
                          : `${selectedRecap.previousMonthDelta > 0 ? '+' : ''}${selectedRecap.previousMonthDelta} par rapport au mois précédent.`}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/16 rounded-2xl p-4 backdrop-blur">
                      <p className="text-4xl font-black">{selectedRecap.activeDays}</p>
                      <p className="font-bold mt-1">jours actifs</p>
                      <p className="text-sm text-white/70">{selectedRecap.averagePerActiveDay.toFixed(1).replace('.', ',')} par jour actif</p>
                    </div>
                    <div className="bg-white/16 rounded-2xl p-4 backdrop-blur">
                      <p className="text-4xl font-black">{selectedRecap.perfectRate}%</p>
                      <p className="font-bold mt-1">cacas parfaits</p>
                      <p className="text-sm text-white/70">{selectedRecap.perfectCount} type 4 {selectedRecap.topType?.emoji}</p>
                    </div>
                    <div className="bg-white/16 rounded-2xl p-4 backdrop-blur">
                      <p className="text-4xl font-black">{selectedRecap.favoriteHour || '--'}</p>
                      <p className="font-bold mt-1">heure favorite</p>
                      <p className="text-sm text-white/70">créneau le plus fréquent</p>
                    </div>
                    <div className="bg-white/16 rounded-2xl p-4 backdrop-blur">
                      <p className="text-4xl font-black">{selectedRecap.longestStreak}j</p>
                      <p className="font-bold mt-1">meilleure série</p>
                      <p className="text-sm text-white/70">dans le mois</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-white/16 rounded-2xl p-4">
                      <p className="text-sm text-white/70 mb-1">Type favori</p>
                      <p className="text-xl font-extrabold">{selectedRecap.topType?.emoji} {selectedRecap.topType?.label || '--'}</p>
                    </div>
                    <div className="bg-white/16 rounded-2xl p-4">
                      <p className="text-sm text-white/70 mb-1">Taille signature</p>
                      <p className="text-xl font-extrabold">{selectedRecap.topSize?.emoji} {selectedRecap.topSize?.label || '--'}</p>
                    </div>
                    <div className="bg-white/16 rounded-2xl p-4">
                      <p className="text-sm text-white/70 mb-1">Lieux utilisés</p>
                      <p className="text-xl font-extrabold">{selectedRecap.locationTagsUsedCount}/{selectedRecap.locationTagsTotal}</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-white/16 rounded-2xl p-4">
                    <p className="text-sm text-white/70 mb-1">Moment culte</p>
                    <p className="text-xl font-extrabold">
                      {selectedRecap.bestDay
                        ? `${dayFormatter.format(new Date(`${selectedRecap.bestDay.date}T00:00:00`))} avec ${selectedRecap.bestDay.count} passage${selectedRecap.bestDay.count > 1 ? 's' : ''}`
                        : 'Pas encore de pic ce mois-ci'}
                    </p>
                    <p className="text-white/75 mt-1">Top lieu : {selectedRecap.topLocation || 'pas encore de lieu favori'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => exportImage(true)}
                    disabled={exporting}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-semibold ${colorClasses.bg} ${colorClasses.hover} disabled:opacity-60 transition-all`}
                  >
                    {exporting ? 'Génération...' : 'Partager en image'}
                  </button>
                  <button
                    onClick={() => exportImage(false)}
                    disabled={exporting}
                    className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-60 transition-all"
                  >
                    Télécharger le PNG
                  </button>
                </div>
                {shareMessage && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 text-center">{shareMessage}</p>
                )}
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3 text-center">
                  Format story vertical 1080x1920, prêt pour Instagram ou Messages.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
