'use server'

import { createClient } from '@/lib/supabase/server'
import { PoopLogInsert } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function addPoopLog(data: PoopLogInsert) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('poop_logs')
    .insert({
      user_id: user.id,
      ...data,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getPoopLogs() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Non authentifié', data: [] }
  }

  const { data, error } = await supabase
    .from('poop_logs')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  if (error) {
    return { error: error.message, data: [] }
  }

  return { data: data || [] }
}

export async function deletePoopLog(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('poop_logs')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
