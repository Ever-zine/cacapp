"use client"

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { PoopLog, POOP_TYPES, UserProfile, ACCENT_COLORS, AccentColor } from '@/lib/types'
import AddPoopForm from './AddPoopForm'
import MapView from './MapView'
import ProfileSettings from './ProfileSettings'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import 'leaflet/dist/leaflet.css'

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

  const accentColor = profile?.accent_color || 'amber'
  const colorClasses = getColorClasses(accentColor)
  const currentColorHex = ACCENT_COLORS.find(c => c.value === accentColor)?.hex || '#f59e0b'

  const handleLogAdded = (newLog: PoopLog) => {
    setLogs([newLog, ...logs])
    setShowForm(false)
    setEditingLog(null)
  }

  const handleLogUpdated = (updatedLog: PoopLog) => {
    setLogs(logs.map(log => log.id === updatedLog.id ? updatedLog : log))
    setShowForm(false)
    setEditingLog(null)
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

      setLogs((data as PoopLog[]) || [])
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
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Add button */}
        <button
          onClick={() => setShowForm(true)}
          className={`w-full mb-8 py-4 ${colorClasses.bg} ${colorClasses.hover} text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3`}
        >
          <span className="text-2xl">💩</span>
          <span>Nouvelle commission</span>
        </button>

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${colorClasses.text}`}>{logs.length}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-bold ${colorClasses.text}`}>
              {logs.filter(l => l.date === new Date().toISOString().split('T')[0]).length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Aujourd'hui</p>
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
        </div>

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
              Aucune entrée pour l'instant.<br />
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
                              "{log.comments}"
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
