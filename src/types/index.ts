export interface Propiedad {
  id: string
  titulo: string
  descripcion: string
  descripcion_corta: string
  precio: number
  moneda: 'USD' | 'ARS'
  ubicacion: string
  barrio?: string
  ciudad: string
  tipo: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'country'
  m2_totales: number
  m2_cubiertos?: number
  habitaciones?: number
  banos?: number
  cochera?: boolean
  pileta?: boolean
  video_url?: string
  musica_url?: string
  fotos: string[]
  estado: 'disponible' | 'reservado' | 'vendido'
  destacada: boolean
  amenidades?: string[]
  año_construccion?: number
  expensas?: number
  etiqueta?: 'nuevo' | 'oportunidad' | 'premium' | 'rebajado'
  latitud?: number
  longitud?: number
  created_at: string
}

export interface Lead {
  id?: string
  nombre: string
  telefono: string
  email?: string
  propiedad_id?: string
  origen: 'web' | 'whatsapp' | 'voz' | 'formulario'
  mensaje?: string
  estado?: 'nuevo' | 'contactado' | 'calificado' | 'visita_agendada' | 'propuesta_enviada' | 'cerrado' | 'perdido'
  zona_interes?: string
  presupuesto?: string
  tipo_interes?: string
  notas?: string
  created_at?: string
}

export interface Agenda {
  id?: string
  nombre: string
  telefono: string
  email?: string
  tipo: 'visita' | 'videollamada' | 'llamada'
  propiedad_id?: string
  fecha: string
  horario: string
  estado?: 'confirmada' | 'cancelada' | 'completada'
  notas?: string
  created_at?: string
}

export interface Testimonio {
  id?: string
  nombre: string
  tipo_operacion?: string
  texto: string
  calificacion: number
  activo?: boolean
  created_at?: string
}

export type FiltroTipo = 'todos' | 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'country'

export type OrdenTipo = 'precio_asc' | 'precio_desc' | 'recientes' | 'destacados'

export type VistaTipo = 'grilla' | 'lista'
