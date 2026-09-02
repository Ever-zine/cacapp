"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
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
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#6e8e72]/25 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff8ee] text-2xl">💩</span>
            <span className="text-xl font-black tracking-[-0.04em]">CacApp</span>
          </div>
          <div className="relative max-w-md">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-[#9fc0a4]">Simple. Discret. Sans jugement.</p>
            <h1 className="text-6xl font-black leading-[0.92] tracking-[-0.065em]">Faites parler les données.</h1>
            <p className="mt-6 max-w-sm text-lg leading-7 text-[#d8cfc4]">Quelques secondes par passage suffisent pour faire apparaître vos rythmes, séries et souvenirs.</p>
          </div>
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-6 text-[#d8cfc4]">“Enfin une app de santé qui ne se prend pas trop au sérieux.”</p>
            <p className="mt-3 text-xs font-black uppercase tracking-widest text-[#9fc0a4]">— Le bon sens</p>
          </div>
        </section>

        <section className="px-5 py-7 sm:p-10 lg:flex lg:flex-col lg:justify-center">
          <div className="mb-8 lg:hidden">
            <div className="mb-8 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-2xl">💩</span>
              <span className="text-xl font-black tracking-[-0.04em]">CacApp</span>
            </div>
            <p className="eyebrow mb-3">Bienvenue à bord</p>
            <h1 className="display-title text-[2.65rem]">Commencez votre journal.</h1>
          </div>

          <div className="hidden lg:block">
            <p className="eyebrow mb-3">Bienvenue à bord</p>
            <h2 className="text-3xl font-black tracking-[-0.045em]">Créer un compte</h2>
            <p className="muted-copy mt-2">Votre premier passage est à quelques secondes.</p>
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
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-bold">Mot de passe</label>
                <span className="muted-copy text-xs">6 caractères minimum</span>
              </div>
              <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" className="app-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="app-button-primary w-full">
              {loading ? 'Création en cours…' : 'Créer mon journal'}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="muted-copy mt-7 text-center text-sm">
            Déjà membre ?{' '}
            <Link href="/login" className="font-extrabold text-[var(--brand)] hover:underline">Se connecter</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
