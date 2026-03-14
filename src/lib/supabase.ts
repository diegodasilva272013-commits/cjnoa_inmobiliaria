import { createClient } from '@supabase/supabase-js'
import type { Propiedad, Lead, Agenda, Testimonio } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getPropiedades(): Promise<Propiedad[]> {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .eq('estado', 'disponible')
    .order('destacada', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getPropiedadesDestacadas(): Promise<Propiedad[]> {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .eq('destacada', true)
    .eq('estado', 'disponible')
    .limit(6)
  if (error) throw error
  return data || []
}

export async function getPropiedad(id: string): Promise<Propiedad> {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function saveLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('leads').insert([lead])
  if (error) throw error
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateLeadEstado(id: string, estado: Lead['estado']): Promise<void> {
  const { error } = await supabase.from('leads').update({ estado }).eq('id', id)
  if (error) throw error
}

export async function saveAgenda(agenda: Omit<Agenda, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('agenda').insert([agenda])
  if (error) throw error
}

export async function getAgendas(): Promise<Agenda[]> {
  const { data, error } = await supabase
    .from('agenda')
    .select('*')
    .order('fecha', { ascending: true })
    .order('horario', { ascending: true })
  if (error) throw error
  return data || []
}

export async function updateAgendaEstado(id: string, estado: Agenda['estado']): Promise<void> {
  const { error } = await supabase.from('agenda').update({ estado }).eq('id', id)
  if (error) throw error
}

export async function getTestimonios(): Promise<Testimonio[]> {
  const { data, error } = await supabase
    .from('testimonios')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
