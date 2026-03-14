'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Download, MessageCircle, Filter, ChevronDown, X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import NextLink from 'next/link'
import type { Lead } from '@/types'

type EstadoLead = 'nuevo' | 'contactado' | 'calificado' | 'visita_agendada' | 'propuesta_enviada' | 'cerrado' | 'perdido'

const ESTADOS: { value: EstadoLead; label: string; color: string }[] = [
  { value: 'nuevo', label: 'Nuevo', color: 'bg-blue-900/60 text-blue-300 border-blue-500/30' },
  { value: 'contactado', label: 'Contactado', color: 'bg-sky-900/60 text-sky-300 border-sky-500/30' },
  { value: 'calificado', label: 'Calificado', color: 'bg-violet-900/60 text-violet-300 border-violet-500/30' },
  { value: 'visita_agendada', label: 'Visita agendada', color: 'bg-amber-900/60 text-amber-300 border-amber-500/30' },
  { value: 'propuesta_enviada', label: 'Propuesta enviada', color: 'bg-orange-900/60 text-orange-300 border-orange-500/30' },
  { value: 'cerrado', label: 'Cerrado', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/30' },
  { value: 'perdido', label: 'Perdido', color: 'bg-red-900/60 text-red-300 border-red-500/30' },
]

const ORIGENES = ['todos', 'web', 'whatsapp', 'voz', 'formulario']

const MOCK_LEADS: Lead[] = [
  { id: '1', nombre: 'María González', telefono: '+54388412345', email: 'maria@email.com', origen: 'web', estado: 'nuevo', mensaje: 'Interesada en casa en Alto Gorriti', created_at: new Date().toISOString() },
  { id: '2', nombre: 'Carlos Herrera', telefono: '+54388498765', email: '', origen: 'whatsapp', estado: 'contactado', zona_interes: 'Centro', presupuesto: 'USD 150,000', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', nombre: 'Ana Rodríguez', telefono: '+54388456789', email: 'ana@email.com', origen: 'formulario', estado: 'visita_agendada', tipo_interes: 'departamento', created_at: new Date(Date.now() - 172800000).toISOString() },
]

function getEstadoConfig(estado?: string) {
  return ESTADOS.find(e => e.value === estado) || ESTADOS[0]
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroOrigen, setFiltroOrigen] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [editNota, setEditNota] = useState<string | null>(null)
  const [notaText, setNotaText] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setLeads(data)
      else setLeads(MOCK_LEADS)
    } catch {
      setLeads(MOCK_LEADS)
    } finally {
      setLoading(false)
    }
  }

  const changeEstado = async (id: string, estado: EstadoLead) => {
    await supabase.from('leads').update({ estado }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, estado } : l))
  }

  const guardarNota = async (id: string) => {
    await supabase.from('leads').update({ notas: notaText }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notas: notaText } : l))
    setEditNota(null)
  }

  const exportCSV = () => {
    const headers = ['Nombre', 'Teléfono', 'Email', 'Origen', 'Estado', 'Zona', 'Presupuesto', 'Notas', 'Fecha']
    const rows = filteredLeads.map(l => [
      l.nombre, l.telefono, l.email || '', l.origen, l.estado || 'nuevo',
      l.zona_interes || '', l.presupuesto || '', l.notas || '',
      l.created_at ? new Date(l.created_at).toLocaleDateString('es-AR') : ''
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `leads_cjnoa_${new Date().toISOString().split('T')[0]}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  const filteredLeads = leads.filter(l => {
    const okEstado = filtroEstado === 'todos' || l.estado === filtroEstado
    const okOrigen = filtroOrigen === 'todos' || l.origen === filtroOrigen
    const okFecha = !filtroFecha || (l.created_at && l.created_at.startsWith(filtroFecha))
    return okEstado && okOrigen && okFecha
  })

  // Stats
  const stats = ESTADOS.map(e => ({
    ...e,
    count: leads.filter(l => (l.estado || 'nuevo') === e.value).length
  }))

  return (
    <div className="min-h-screen bg-dark">
      {/* Nav */}
      <div className="glass-nav px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NextLink href="/admin" className="flex items-center gap-2 text-silver/50 hover:text-gold transition-colors duration-200 font-body text-xs tracking-widest uppercase">
            <ArrowLeft size={14} /> Admin
          </NextLink>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="font-display text-lg font-400 text-white">CRM <span className="text-gold-static">Leads</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm border font-body text-xs tracking-widest uppercase transition-all duration-200 ${showFilters ? 'border-gold/40 text-gold bg-gold/5' : 'border-white/10 text-silver/40 hover:border-gold/20'}`}>
            <Filter size={13} /> Filtros
          </button>
          <button onClick={exportCSV} className="btn-gold-outline flex items-center gap-2 px-4 py-2 rounded-sm text-xs">
            <Download size={13} /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {stats.map(s => (
            <div key={s.value}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-body font-600 ${s.color} cursor-pointer transition-all duration-200 hover:opacity-80`}
              onClick={() => setFiltroEstado(filtroEstado === s.value ? 'todos' : s.value)}>
              <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px] font-700">{s.count}</span>
              {s.label}
            </div>
          ))}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-xs text-silver/40 uppercase tracking-widest mb-2 block">Estado</label>
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                className="luxury-input w-full px-3 py-2.5 rounded-sm font-body text-sm">
                <option value="todos">Todos</option>
                {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-silver/40 uppercase tracking-widest mb-2 block">Origen</label>
              <select value={filtroOrigen} onChange={e => setFiltroOrigen(e.target.value)}
                className="luxury-input w-full px-3 py-2.5 rounded-sm font-body text-sm">
                {ORIGENES.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-silver/40 uppercase tracking-widest mb-2 block">Fecha</label>
              <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}
                className="luxury-input w-full px-3 py-2.5 rounded-sm font-body text-sm" />
            </div>
          </motion.div>
        )}

        {/* Result count */}
        <p className="font-body text-xs text-silver/40 tracking-widest uppercase mb-4">
          Mostrando {filteredLeads.length} de {leads.length} leads
        </p>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-sm text-silver/30 tracking-widest uppercase">No hay leads con los filtros aplicados</p>
            <button onClick={() => { setFiltroEstado('todos'); setFiltroOrigen('todos'); setFiltroFecha('') }}
              className="btn-gold-outline mt-4 px-5 py-2.5 rounded-sm text-xs">Limpiar filtros</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLeads.map(l => {
              const estadoConf = getEstadoConfig(l.estado)
              const wasWA = `https://wa.me/${l.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${l.nombre}, te contactamos desde Centro Jurídico NOA.`)}`
              return (
                <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-card rounded-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-start lg:items-center">
                  {/* Nombre */}
                  <div className="lg:col-span-1">
                    <div className="font-body text-[10px] text-silver/40 uppercase tracking-wider lg:hidden mb-0.5">Nombre</div>
                    <div className="font-body text-sm font-600 text-white">{l.nombre}</div>
                  </div>

                  {/* Contacto */}
                  <div className="lg:col-span-1">
                    <div className="font-body text-[10px] text-silver/40 uppercase tracking-wider lg:hidden mb-0.5">Contacto</div>
                    <div className="font-body text-xs text-silver/60">{l.telefono}</div>
                    {l.email && <div className="font-body text-xs text-silver/40 truncate">{l.email}</div>}
                  </div>

                  {/* Origen */}
                  <div className="hidden lg:block">
                    <span className="text-[10px] font-body font-600 tracking-widest uppercase text-silver/50 border border-white/10 px-2.5 py-1 rounded-sm">{l.origen}</span>
                  </div>

                  {/* Info adicional */}
                  <div className="hidden lg:block">
                    <div className="font-body text-xs text-silver/40">{l.zona_interes && `📍 ${l.zona_interes}`}</div>
                    <div className="font-body text-xs text-silver/40">{l.presupuesto && `💰 ${l.presupuesto}`}</div>
                    <div className="font-body text-xs text-silver/40">{l.tipo_interes && `🏠 ${l.tipo_interes}`}</div>
                  </div>

                  {/* Estado selector */}
                  <div className="lg:col-span-1">
                    <select value={l.estado || 'nuevo'}
                      onChange={e => l.id && changeEstado(l.id, e.target.value as EstadoLead)}
                      className={`luxury-input text-[10px] font-700 tracking-widest uppercase px-2.5 py-1.5 rounded-sm border cursor-pointer w-full ${estadoConf.color}`}>
                      {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>

                  {/* Fecha */}
                  <div className="hidden lg:block">
                    <div className="font-body text-xs text-silver/40">
                      {l.created_at ? new Date(l.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <a href={wasWA} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-sm border border-emerald-500/30 bg-emerald-900/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-900/50 transition-all duration-200" title="WhatsApp">
                      <MessageCircle size={13} />
                    </a>
                    <button onClick={() => { setEditNota(l.id || null); setNotaText(l.notas || '') }}
                      className="w-8 h-8 rounded-sm border border-white/10 flex items-center justify-center text-silver/40 hover:border-gold/30 hover:text-gold transition-all duration-200 text-xs font-600" title="Nota">
                      📝
                    </button>
                  </div>

                  {/* Nota expandida */}
                  {editNota === l.id && (
                    <div className="lg:col-span-7 mt-2 flex gap-2">
                      <input value={notaText} onChange={e => setNotaText(e.target.value)}
                        placeholder="Agregar nota..." className="luxury-input flex-1 px-3 py-2 rounded-sm font-body text-xs" />
                      <button onClick={() => guardarNota(l.id!)} className="btn-gold px-3 py-2 rounded-sm text-xs">Guardar</button>
                      <button onClick={() => setEditNota(null)} className="btn-gold-outline px-3 py-2 rounded-sm text-xs">✕</button>
                    </div>
                  )}
                  {l.notas && editNota !== l.id && (
                    <div className="lg:col-span-7 mt-1">
                      <p className="font-body text-xs text-silver/40 italic border-l border-gold/20 pl-3">{l.notas}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
