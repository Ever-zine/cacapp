'use client'

import { useEffect, useState } from 'react'
import { PoopLog, POOP_TYPES, UserProfile, ACCENT_COLORS } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapViewProps {
  onEdit?: (log: PoopLog) => void
  currentUserId?: string
}

interface PoopLogWithProfile extends PoopLog {
  profile?: UserProfile
}

interface ClusteredPoop {
  logs: PoopLogWithProfile[]
  latitude: number
  longitude: number
  userId: string
  profile?: UserProfile
  count: number
}

export default function MapView({ onEdit, currentUserId }: MapViewProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [allLogs, setAllLogs] = useState<PoopLogWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)
    })
  }, [])

  // Charger tous les logs avec les profils
  useEffect(() => {
    const loadAllLogs = async () => {
      const supabase = createClient()
      
      // Charger tous les logs
      const { data: logs } = await supabase
        .from('poop_logs')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('date', { ascending: false })

      // Charger tous les profils
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')

      if (logs && profiles) {
        const profileMap = new Map<string, UserProfile>()
        profiles.forEach((p: UserProfile) => profileMap.set(p.user_id, p))

        const logsWithProfiles = logs.map((log: PoopLog) => ({
          ...log,
          profile: profileMap.get(log.user_id)
        }))

        setAllLogs(logsWithProfiles)
      }
      setLoading(false)
    }

    loadAllLogs()
  }, [])

  // Regrouper les logs par position arrondie et utilisateur
  const clusterLogs = (): ClusteredPoop[] => {
    const clusters = new Map<string, ClusteredPoop>()
    const precision = 4 // Nombre de décimales pour le regroupement (~11m de précision)

    allLogs.forEach(log => {
      if (!log.latitude || !log.longitude) return

      const roundedLat = log.latitude.toFixed(precision)
      const roundedLng = log.longitude.toFixed(precision)
      const key = `${log.user_id}_${roundedLat}_${roundedLng}`

      if (!clusters.has(key)) {
        clusters.set(key, {
          logs: [],
          latitude: log.latitude,
          longitude: log.longitude,
          userId: log.user_id,
          profile: log.profile,
          count: 0
        })
      }

      const cluster = clusters.get(key)!
      cluster.logs.push(log)
      cluster.count++
    })

    return Array.from(clusters.values())
  }

  const getCenter = (): [number, number] => {
    if (allLogs.length === 0) {
      return [46.603354, 1.888334] // Centre de la France
    }
    const avgLat = allLogs.reduce((sum, log) => sum + (log.latitude || 0), 0) / allLogs.length
    const avgLng = allLogs.reduce((sum, log) => sum + (log.longitude || 0), 0) / allLogs.length
    return [avgLat, avgLng]
  }

  const getPoopTypeInfo = (type: string) => {
    return POOP_TYPES.find(t => t.value === type) || POOP_TYPES[0]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  // Créer une icône personnalisée avec cercle coloré et emoji
  const createUserIcon = (profile: UserProfile | undefined, count: number) => {
    if (!L) return undefined

    const emoji = profile?.avatar_emoji || '💩'
    const colorHex = ACCENT_COLORS.find(c => c.value === profile?.accent_color)?.hex || '#f59e0b'
    
    // Taille basée sur le nombre de cacas (min 40, max 80)
    const baseSize = 40
    const size = Math.min(baseSize + (count - 1) * 8, 80)
    const fontSize = Math.min(16 + (count - 1) * 3, 32)

    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${colorHex};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${fontSize}px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        ">
          ${emoji}
          ${count > 1 ? `<span style="
            position: absolute;
            top: -5px;
            right: -5px;
            background: white;
            color: ${colorHex};
            font-size: 11px;
            font-weight: bold;
            min-width: 18px;
            height: 18px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid ${colorHex};
          ">${count}</span>` : ''}
        </div>
      `,
      className: 'user-poop-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    })
  }

  if (!isClient || !L || loading) {
    return (
      <div className="paper-card p-10 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
        <p className="muted-copy text-sm font-bold">Chargement de la carte…</p>
      </div>
    )
  }

  const clusters = clusterLogs()

  if (clusters.length === 0) {
    return (
      <div className="paper-card px-6 py-14 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--brand-soft)] text-4xl">⌖</span>
        <h2 className="mt-5 text-xl font-black tracking-[-0.03em]">La carte attend vos premiers points</h2>
        <p className="muted-copy mx-auto mt-2 max-w-sm text-sm leading-6">
          Aucune entrée avec géolocalisation.<br />
          Activez la localisation pour faire apparaître vos passages.
        </p>
      </div>
    )
  }

  // Stats globales
  const uniqueUsers = new Set(allLogs.map(l => l.user_id)).size

  return (
    <div className="paper-card relative z-0 isolate overflow-hidden">
      <style jsx global>{`
        .user-poop-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(43, 33, 25, 0.2);
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
      <MapContainer
        center={getCenter()}
        zoom={clusters.length === 1 ? 15 : 6}
        style={{ height: 'min(65dvh, 620px)', minHeight: '420px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clusters.map((cluster, index) => {
          const colorHex = ACCENT_COLORS.find(c => c.value === cluster.profile?.accent_color)?.hex || '#f59e0b'
          return (
            <Marker
              key={`${cluster.userId}_${index}`}
              position={[cluster.latitude, cluster.longitude]}
              icon={createUserIcon(cluster.profile, cluster.count)}
            >
              <Popup>
                <div className="min-w-[220px] max-w-[280px]">
                  {/* En-tête avec profil */}
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-200">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${colorHex}30`, border: `2px solid ${colorHex}` }}
                    >
                      {cluster.profile?.avatar_emoji || '💩'}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800">
                        {cluster.profile?.pseudo || 'Anonyme'}
                      </p>
                      <p className="text-xs" style={{ color: colorHex }}>
                        {cluster.count} caca{cluster.count > 1 ? 's' : ''} ici
                      </p>
                    </div>
                  </div>

                  {/* Liste des derniers cacas */}
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {cluster.logs.slice(0, 5).map((log) => {
                      const typeInfo = getPoopTypeInfo(log.poop_type)
                      const isOwn = log.user_id === currentUserId
                      return (
                        <div 
                          key={log.id} 
                          className={`flex items-start gap-2 p-2 rounded-lg ${isOwn ? 'bg-amber-50' : 'bg-zinc-50'}`}
                        >
                          <span className="text-lg">{typeInfo.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-600">
                              {formatDate(log.date)} à {log.time.slice(0, 5)}
                            </p>
                            <p className="text-xs text-zinc-500">📍 {log.location}</p>
                            {log.comments && (
                              <p className="text-xs text-zinc-400 italic truncate">&ldquo;{log.comments}&rdquo;</p>
                            )}
                          </div>
                          {isOwn && onEdit && (
                            <button
                              onClick={() => onEdit(log)}
                              className="text-xs px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )
                    })}
                    {cluster.logs.length > 5 && (
                      <p className="text-xs text-zinc-400 text-center">
                        ... et {cluster.logs.length - 5} autre{cluster.logs.length - 5 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-5">
        <div><p className="text-sm font-black">La carte de la communauté</p><p className="muted-copy text-xs">Les entrées géolocalisées, regroupées par lieu</p></div>
        <p className="shrink-0 rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-black text-[var(--brand)]">
          {allLogs.length} · {uniqueUsers} membre{uniqueUsers > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
