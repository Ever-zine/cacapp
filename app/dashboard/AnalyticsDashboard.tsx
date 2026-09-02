'use client'

import { useMemo, useState } from 'react'
import { POOP_SIZES, POOP_TYPES, PoopLog } from '@/lib/types'

type Period = '30' | '90' | 'all'

interface AnalyticsDashboardProps {
  logs: PoopLog[]
  accentHex: string
}

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getStartDate = (period: Period) => {
  if (period === 'all') return null

  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - Number(period) + 1)
  return formatDateKey(date)
}

const getPeriodLabel = (period: Period) => {
  if (period === 'all') return 'Depuis le début'
  return `Les ${period} derniers jours`
}

const getWeekdayLabel = (date: string) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short' })
  .format(new Date(`${date}T12:00:00`))
  .replace('.', '')

const formatPercentage = (value: number) => `${Math.round(value)} %`

export default function AnalyticsDashboard({ logs, accentHex }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<Period>('30')

  const analytics = useMemo(() => {
    const startDate = getStartDate(period)
    const filteredLogs = startDate ? logs.filter(log => log.date >= startDate) : logs
    const total = filteredLogs.length
    const activeDays = new Set(filteredLogs.map(log => log.date)).size
    const perfectCount = filteredLogs.filter(log => log.poop_type === 'type4').length
    const typeCounts = POOP_TYPES.map(type => ({
      ...type,
      count: filteredLogs.filter(log => log.poop_type === type.value).length,
    }))
    const sizeCounts = POOP_SIZES.map(size => ({
      ...size,
      count: filteredLogs.filter(log => log.size === size.value).length,
    }))
    const topType = [...typeCounts].sort((a, b) => b.count - a.count)[0]
    const topSize = [...sizeCounts].sort((a, b) => b.count - a.count)[0]

    const hourBands = [
      { label: 'Matin', range: '06–10h', count: 0 },
      { label: 'Midi', range: '10–14h', count: 0 },
      { label: 'Après-midi', range: '14–18h', count: 0 },
      { label: 'Soir', range: '18–22h', count: 0 },
      { label: 'Nuit', range: '22–06h', count: 0 },
    ]
    filteredLogs.forEach(log => {
      const hour = Number(log.time.slice(0, 2))
      const bandIndex = hour >= 6 && hour < 10 ? 0
        : hour >= 10 && hour < 14 ? 1
          : hour >= 14 && hour < 18 ? 2
            : hour >= 18 && hour < 22 ? 3 : 4
      hourBands[bandIndex].count++
    })
    const topHourBand = [...hourBands].sort((a, b) => b.count - a.count)[0]

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const recentDays = Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - 13 + index)
      const dateKey = formatDateKey(date)
      return {
        date: dateKey,
        label: getWeekdayLabel(dateKey),
        count: logs.filter(log => log.date === dateKey).length,
      }
    })

    let previousTotal: number | null = null
    if (period !== 'all') {
      const currentStart = new Date(`${startDate}T12:00:00`)
      const previousEnd = new Date(currentStart)
      previousEnd.setDate(previousEnd.getDate() - 1)
      const previousStart = new Date(previousEnd)
      previousStart.setDate(previousStart.getDate() - Number(period) + 1)
      const previousStartKey = formatDateKey(previousStart)
      const previousEndKey = formatDateKey(previousEnd)
      previousTotal = logs.filter(log => log.date >= previousStartKey && log.date <= previousEndKey).length
    }

    return {
      filteredLogs,
      total,
      activeDays,
      perfectCount,
      typeCounts,
      sizeCounts,
      topType,
      topSize,
      hourBands,
      topHourBand,
      recentDays,
      maxRecentCount: Math.max(...recentDays.map(day => day.count), 1),
      previousTotal,
    }
  }, [logs, period])

  const averagePerActiveDay = analytics.total / Math.max(analytics.activeDays, 1)
  const delta = analytics.previousTotal === null ? null : analytics.total - analytics.previousTotal

  if (logs.length === 0) {
    return (
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-5xl mb-3">📈</p>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Vos tendances apparaîtront ici</h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Ajoutez quelques entrées pour découvrir votre rythme, vos types et vos créneaux les plus fréquents.</p>
      </section>
    )
  }

  return (
    <section className="space-y-6" aria-label="Tableau de bord analytique">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: accentHex }}>Vos tendances</p>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Tableau de bord analytique</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Une lecture de votre historique, sans interprétation médicale.</p>
        </div>
        <div className="flex rounded-xl bg-white dark:bg-zinc-900 p-1 shadow-sm" role="group" aria-label="Période d'analyse">
          {(['30', '90', 'all'] as Period[]).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                period === option
                  ? 'text-white shadow-sm'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
              style={period === option ? { backgroundColor: accentHex } : undefined}
            >
              {option === 'all' ? 'Tout' : `${option} j`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Passages" value={analytics.total} detail={getPeriodLabel(period)} />
        <MetricCard label="Jours actifs" value={analytics.activeDays} detail={`${averagePerActiveDay.toFixed(1).replace('.', ',')} / jour actif`} />
        <MetricCard label="Type 4" value={formatPercentage((analytics.perfectCount / Math.max(analytics.total, 1)) * 100)} detail={`${analytics.perfectCount} passage${analytics.perfectCount > 1 ? 's' : ''} parfait${analytics.perfectCount > 1 ? 's' : ''}`} />
        <MetricCard
          label="Évolution"
          value={delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta}`}
          detail={delta === null ? 'Pas de comparaison' : 'vs période précédente'}
          valueClass={delta !== null && delta > 0 ? 'text-emerald-600' : delta !== null && delta < 0 ? 'text-rose-600' : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Votre rythme récent</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">14 derniers jours</p>
            </div>
            <span className="text-2xl" aria-hidden="true">📅</span>
          </div>
          <div className="flex h-40 items-end gap-1.5 sm:gap-2" aria-label="Nombre de passages par jour sur les 14 derniers jours">
            {analytics.recentDays.map(day => (
              <div key={day.date} className="flex h-full flex-1 flex-col justify-end gap-2 text-center min-w-0" title={`${day.date} : ${day.count} passage${day.count > 1 ? 's' : ''}`}>
                <div
                  className="min-h-1 rounded-t-md transition-all"
                  style={{ height: `${Math.max((day.count / analytics.maxRecentCount) * 100, day.count > 0 ? 8 : 2)}%`, backgroundColor: day.count > 0 ? accentHex : '#e4e4e7' }}
                />
                <span className="truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <InsightCard
          accentHex={accentHex}
          topType={analytics.topType}
          topSize={analytics.topSize}
          topHourBand={analytics.topHourBand}
          total={analytics.total}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DistributionCard title="Répartition des types" subtitle="Échelle de Bristol" accentHex={accentHex} items={analytics.typeCounts.map(item => ({ label: item.label, emoji: item.emoji, count: item.count }))} total={analytics.total} />
        <DistributionCard title="Répartition des tailles" subtitle="Vos passages par taille" accentHex={accentHex} items={analytics.sizeCounts.map(item => ({ label: item.label, emoji: item.emoji, count: item.count }))} total={analytics.total} />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-xl">⏰</span>
          <div>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Moments de la journée</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Répartition par créneau horaire</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {analytics.hourBands.map(band => (
            <div key={band.label} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{band.label}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{band.range}</p>
              <p className="mt-2 text-xl font-bold" style={{ color: accentHex }}>{band.count}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full rounded-full" style={{ width: `${(band.count / Math.max(analytics.total, 1)) * 100}%`, backgroundColor: accentHex }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MetricCard({ label, value, detail, valueClass }: { label: string; value: string | number; detail: string; valueClass?: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
      <p className={`text-2xl font-bold ${valueClass || 'text-zinc-800 dark:text-zinc-100'}`}>{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</p>
      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{detail}</p>
    </div>
  )
}

function InsightCard({ accentHex, topType, topSize, topHourBand, total }: {
  accentHex: string
  topType: { label: string; emoji: string; description: string; count: number }
  topSize: { label: string; emoji: string; count: number }
  topHourBand: { label: string; range: string; count: number }
  total: number
}) {
  return (
    <div className="rounded-2xl p-5 text-white shadow-sm lg:col-span-2" style={{ background: `linear-gradient(135deg, ${accentHex}, #27272a)` }}>
      <p className="text-sm font-semibold uppercase tracking-wide text-white/75">En un coup d&apos;œil</p>
      <div className="mt-4 space-y-4">
        <p><span className="mr-2 text-xl">{topType.emoji}</span> Type le plus fréquent : <strong>{topType.label}</strong> ({formatPercentage((topType.count / Math.max(total, 1)) * 100)}).</p>
        <p><span className="mr-2 text-xl">{topSize.emoji}</span> Taille la plus fréquente : <strong>{topSize.label}</strong>.</p>
        <p><span className="mr-2 text-xl">{topHourBand.count > 0 ? '⏰' : '—'}</span> Créneau le plus fréquent : <strong>{topHourBand.count > 0 ? `${topHourBand.label} (${topHourBand.range})` : 'pas encore de donnée'}</strong>.</p>
      </div>
    </div>
  )
}

function DistributionCard({ title, subtitle, accentHex, items, total }: {
  title: string
  subtitle: string
  accentHex: string
  items: { label: string; emoji: string; count: number }[]
  total: number
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-zinc-900">
      <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{title}</h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-zinc-700 dark:text-zinc-200">{item.emoji} {item.label}</span>
              <span className="shrink-0 text-zinc-500 dark:text-zinc-400">{item.count} · {formatPercentage((item.count / Math.max(total, 1)) * 100)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full rounded-full" style={{ width: `${(item.count / Math.max(total, 1)) * 100}%`, backgroundColor: accentHex }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
