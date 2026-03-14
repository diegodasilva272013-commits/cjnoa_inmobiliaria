import type { Propiedad, Lead, Agenda, Testimonio } from '@/types'
import { MOCK_PROPIEDADES } from '@/lib/utils'

// Stub export for components that import `supabase` directly
export const supabase = null as any

export async function getPropiedades(): Promise<Propiedad[]> {
  return MOCK_PROPIEDADES.filter(p => p.estado === 'disponible')
    .sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0))
}

export async function getPropiedadesDestacadas(): Promise<Propiedad[]> {
  return MOCK_PROPIEDADES.filter(p => p.destacada && p.estado === 'disponible').slice(0, 6)
}

export async function getPropiedad(id: string): Promise<Propiedad> {
  const p = MOCK_PROPIEDADES.find(p => p.id === id)
  if (!p) throw new Error('Propiedad no encontrada')
  return p
}

export async function saveLead(_lead: Omit<Lead, 'id' | 'created_at'>): Promise<void> {
  // No-op until Supabase is connected
}

export async function getLeads(): Promise<Lead[]> {
  return []
}

export async function updateLeadEstado(_id: string, _estado: Lead['estado']): Promise<void> {
  // No-op until Supabase is connected
}

export async function saveAgenda(_agenda: Omit<Agenda, 'id' | 'created_at'>): Promise<void> {
  // No-op until Supabase is connected
}

export async function getAgendas(): Promise<Agenda[]> {
  return []
}

export async function updateAgendaEstado(_id: string, _estado: Agenda['estado']): Promise<void> {
  // No-op until Supabase is connected
}

export async function getTestimonios(): Promise<Testimonio[]> {
  return []
}
