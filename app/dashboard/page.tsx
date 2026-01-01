import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PoopLog } from '@/lib/types'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: logs } = await supabase
    .from('poop_logs')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  return <DashboardClient user={user} initialLogs={(logs as PoopLog[]) || []} />
}
