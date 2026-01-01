"use client"

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { PoopLog, POOP_TYPES } from '@/lib/types'
import AddPoopForm from './AddPoopForm'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardClient() {
  const [logs, setLogs] = useState<PoopLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState<PoopLog | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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

      const { data } = await supabase
        .from('poop_logs')
        .select('*')
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💩</span>
            <div>
              <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">CacApp</h1>
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
          className="w-full mb-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
        >
          <span className="text-2xl">💩</span>
          <span>Nouvelle commission</span>
        </button>

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
            <p className="text-2xl font-bold text-amber-600">{logs.length}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">
              {logs.filter(l => l.date === new Date().toISOString().split('T')[0]).length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Aujourd'hui</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">
              {logs.filter(l => l.poop_type === 'type4').length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Parfaits 🐍</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">
              {Object.keys(logsByDate).length}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Jours actifs</p>
          </div>
        </div>

        {/* Logs list */}
        {logs.length === 0 ? (
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
        )}
      </main>
    </div>
  )
}
