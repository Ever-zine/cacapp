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
      <section className="paper-card px-6 py-14 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--brand-soft)] text-4xl">⌁</span>
        <h2 className="mt-5 text-xl font-black tracking-[-0.03em]">Vos tendances apparaîtront ici</h2>
        <p className="muted-copy mx-auto mt-2 max-w-md text-sm leading-6">Ajoutez quelques entrées pour découvrir votre rythme, vos types et vos créneaux les plus fréquents.</p>
      </section>
    )
  }

  return (
    <section className="space-y-5 sm:space-y-6" aria-label="Tableau de bord analytique">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="hidden md:block">
          <p className="eyebrow mb-2" style={{ color: accentHex }}>Vos tendances</p>
          <h2 className="text-2xl font-black tracking-[-0.04em]">Votre rythme en chiffres</h2>
          <p className="muted-copy mt-1 text-sm">Une lecture de votre historique, sans interprétation médicale.</p>
        </div>
        <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm" role="group" aria-label="Période d'analyse">
          {(['30', '90', 'all'] as Period[]).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              className={`min-h-10 rounded-xl px-3 py-2 text-sm font-black transition-colors ${
                period === option
                  ? 'text-white shadow-sm'
                  : 'text-[var(--muted)] hover:bg-[var(--surface-muted)]'
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
        <div className="paper-card p-5 sm:p-6 lg:col-span-3">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-black tracking-[-0.02em]">Votre rythme récent</h3>
              <p className="muted-copy text-sm">14 derniers jours</p>
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
                <span className="muted-copy truncate text-[10px] font-bold">{day.label}</span>
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

      <div className="paper-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-xl">⏰</span>
          <div>
            <h3 className="font-black tracking-[-0.02em]">Moments de la journée</h3>
            <p className="muted-copy text-sm">Répartition par créneau horaire</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {analytics.hourBands.map(band => (
            <div key={band.label} className="paper-card-soft p-3">
              <p className="text-sm font-black">{band.label}</p>
              <p className="muted-copy text-xs">{band.range}</p>
              <p className="mt-2 text-xl font-bold" style={{ color: accentHex }}>{band.count}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
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
    <div className="paper-card-soft p-4">
      <p className={`text-2xl font-black tracking-[-0.04em] ${valueClass || ''}`}>{value}</p>
      <p className="mt-1 text-sm font-black">{label}</p>
      <p className="muted-copy mt-0.5 text-[11px] leading-4">{detail}</p>
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
    <div className="rounded-3xl p-5 text-white shadow-sm sm:p-6 lg:col-span-2" style={{ background: `linear-gradient(135deg, ${accentHex}, #2b2119)` }}>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">En un coup d&apos;œil</p>
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
    <div className="paper-card p-5 sm:p-6">
      <h3 className="font-black tracking-[-0.02em]">{title}</h3>
      <p className="muted-copy mb-4 text-sm">{subtitle}</p>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-semibold">{item.emoji} {item.label}</span>
              <span className="muted-copy shrink-0 font-semibold">{item.count} · {formatPercentage((item.count / Math.max(total, 1)) * 100)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full rounded-full" style={{ width: `${(item.count / Math.max(total, 1)) * 100}%`, backgroundColor: accentHex }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
