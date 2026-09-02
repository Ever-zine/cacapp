"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.get('email') as string,
      password: form.get('password') as string,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="app-page app-container flex min-h-screen items-center py-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden paper-card lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-[42rem] flex-col justify-between overflow-hidden bg-[#2b2119] p-10 text-[#fff8ee] lg:flex">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#b9663c]/30 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff8ee] text-2xl">💩</span>
            <span className="text-xl font-black tracking-[-0.04em]">CacApp</span>
          </div>
          <div className="relative max-w-md">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-[#e8a47e]">Votre quotidien, en mieux documenté</p>
            <h1 className="text-6xl font-black leading-[0.92] tracking-[-0.065em]">Le journal du trône.</h1>
            <p className="mt-6 max-w-sm text-lg leading-7 text-[#d8cfc4]">Un suivi simple, privé et étonnamment motivant de vos habitudes intestinales.</p>
          </div>
          <div className="relative grid grid-cols-3 gap-3 text-sm">
            {['Suivez', 'Comprenez', 'Progressez'].map((label, index) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-2xl">{['◎', '◒', '✦'][index]}</p>
                <p className="font-bold">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-7 sm:p-10 lg:flex lg:flex-col lg:justify-center">
          <div className="mb-8 lg:hidden">
            <div className="mb-8 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-2xl">💩</span>
              <span className="text-xl font-black tracking-[-0.04em]">CacApp</span>
            </div>
            <p className="eyebrow mb-3">Bon retour</p>
            <h1 className="display-title text-[2.65rem]">Reprenez votre rythme.</h1>
          </div>

          <div className="hidden lg:block">
            <p className="eyebrow mb-3">Bon retour</p>
            <h2 className="text-3xl font-black tracking-[-0.045em]">Connexion</h2>
            <p className="muted-copy mt-2">Vos habitudes n’attendent que vous.</p>
          </div>

          {error && (
            <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold">Adresse e-mail</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="app-field" placeholder="vous@exemple.fr" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold">Mot de passe</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" className="app-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="app-button-primary w-full">
              {loading ? 'Connexion en cours…' : 'Entrer dans CacApp'}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="muted-copy mt-7 text-center text-sm">
            Première visite ?{' '}
            <Link href="/signup" className="font-extrabold text-[var(--brand)] hover:underline">Créer un compte</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
