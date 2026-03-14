'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import PropertyCard from './PropertyCard'
import PropertyModal from './PropertyModal'
import { MOCK_PROPIEDADES } from '@/lib/utils'
import { getPropiedades } from '@/lib/supabase'
import type { Propiedad, FiltroTipo, OrdenTipo, VistaTipo } from '@/types'

const FILTROS: { value: FiltroTipo; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'casa', label: 'Casas' },
  { value: 'departamento', label: 'Deptos.' },
  { value: 'country', label: 'Countries' },
  { value: 'terreno', label: 'Terrenos' },
  { value: 'oficina', label: 'Oficinas' },
]

const ORDENES: { value: OrdenTipo; label: string }[] = [
  { value: 'destacados', label: 'Destacados primero' },
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Menor precio' },
  { value: 'precio_desc', label: 'Mayor precio' },
]

export default function PropertiesSection() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(MOCK_PROPIEDADES)
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos')
  const [orden, setOrden] = useState<OrdenTipo>('destacados')
  const [vista, setVista] = useState<VistaTipo>('grilla')
  const [selected, setSelected] = useState<Propiedad | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Advanced filters
  const [minHabitaciones, setMinHabitaciones] = useState(0)
  const [cochera, setCochera] = useState(false)
  const [pileta, setPileta] = useState(false)
  const [precioMax, setPrecioMax] = useState(0)

  useEffect(() => {
    getPropiedades().then(data => { if (data.length) setPropiedades(data) }).catch(() => {})
  }, [])

  const hasAdvancedFilters = minHabitaciones > 0 || cochera || pileta || precioMax > 0

  const clearAdvanced = () => {
    setMinHabitaciones(0); setCochera(false); setPileta(false); setPrecioMax(0)
  }

  const filtered = useMemo(() => {
    let list = filtroTipo === 'todos' ? propiedades : propiedades.filter(p => p.tipo === filtroTipo)

    if (minHabitaciones > 0) list = list.filter(p => (p.habitaciones || 0) >= minHabitaciones)
    if (cochera) list = list.filter(p => p.cochera)
    if (pileta) list = list.filter(p => p.pileta)
    if (precioMax > 0) list = list.filter(p => p.precio <= precioMax)

    return [...list].sort((a, b) => {
      if (orden === 'precio_asc') return a.precio - b.precio
      if (orden === 'precio_desc') return b.precio - a.precio
      if (orden === 'recientes') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      // destacados
      if (a.destacada && !b.destacada) return -1
      if (!a.destacada && b.destacada) return 1
      return 0
    })
  }, [propiedades, filtroTipo, orden, minHabitaciones, cochera, pileta, precioMax])

  return (
    <>
      <section id="propiedades" className="relative py-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.04)_0%,transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="h-px w-12 bg-gold/40" />
              <span className="section-tag">Portafolio Exclusivo</span>
              <div className="h-px w-12 bg-gold/40" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl font-300 text-white mb-4"
            >
              Propiedades{' '}
              <span className="text-gold-shimmer font-600">Disponibles</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-silver/50 text-sm tracking-wider max-w-lg mx-auto"
            >
              Cada propiedad respaldada por nuestro estudio jurídico.
              Transparencia y seguridad en cada transacción.
            </motion.p>
          </div>

          {/* Filter tabs row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between gap-4 flex-wrap mb-4"
          >
            {/* Type filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {FILTROS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltroTipo(f.value)}
                  className={`relative px-5 py-2.5 rounded-sm font-body text-xs font-600 tracking-[0.2em] uppercase transition-all duration-300 ${
                    filtroTipo === f.value
                      ? 'btn-gold'
                      : 'btn-gold-outline opacity-60 hover:opacity-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Advanced filters toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border font-body text-xs tracking-widest uppercase transition-all duration-200 ${
                  showAdvanced || hasAdvancedFilters
                    ? 'border-gold/40 text-gold bg-gold/5'
                    : 'border-white/10 text-silver/40 hover:border-gold/20'
                }`}
              >
                <SlidersHorizontal size={12} />
                Filtros
                {hasAdvancedFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
              </button>

              {/* Order */}
              <div className="relative">
                <select
                  value={orden}
                  onChange={e => setOrden(e.target.value as OrdenTipo)}
                  className="luxury-input pl-3 pr-8 py-2.5 rounded-sm font-body text-xs tracking-wider appearance-none cursor-pointer min-w-[160px]"
                >
                  {ORDENES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gold/40 pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-white/10 rounded-sm overflow-hidden">
                <button
                  onClick={() => setVista('grilla')}
                  className={`p-2.5 transition-all duration-200 ${vista === 'grilla' ? 'bg-gold/10 text-gold' : 'text-silver/30 hover:text-silver/60'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setVista('lista')}
                  className={`p-2.5 transition-all duration-200 ${vista === 'lista' ? 'bg-gold/10 text-gold' : 'text-silver/30 hover:text-silver/60'}`}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Advanced filters panel */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card rounded-sm p-5 mb-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <label className="font-body text-[10px] text-silver/40 uppercase tracking-widest mb-2 block">
                      Habitaciones mínimas
                    </label>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4].map(n => (
                        <button key={n} onClick={() => setMinHabitaciones(n)}
                          className={`w-9 h-9 rounded-sm border font-body text-xs font-600 transition-all duration-200 ${
                            minHabitaciones === n ? 'border-gold/60 bg-gold/10 text-gold' : 'border-white/10 text-silver/40 hover:border-gold/20'
                          }`}>
                          {n === 0 ? 'Todos' : n === 4 ? '4+' : n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-[10px] text-silver/40 uppercase tracking-widest mb-2 block">
                      Precio máximo (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="Sin límite"
                      value={precioMax || ''}
                      onChange={e => setPrecioMax(Number(e.target.value))}
                      className="luxury-input w-full px-3 py-2.5 rounded-sm font-body text-xs"
                      step="10000"
                      min="0"
                    />
                  </div>

                  <div className="flex flex-col justify-end gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => setCochera(!cochera)}
                        className={`w-10 h-5 rounded-full border transition-all duration-200 relative ${
                          cochera ? 'bg-gold/20 border-gold/40' : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                          cochera ? 'left-5 bg-gold' : 'left-0.5 bg-silver/30'
                        }`} />
                      </div>
                      <span className="font-body text-xs text-silver/60 group-hover:text-silver/80 transition-colors duration-200">Con cochera</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => setPileta(!pileta)}
                        className={`w-10 h-5 rounded-full border transition-all duration-200 relative ${
                          pileta ? 'bg-gold/20 border-gold/40' : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                          pileta ? 'left-5 bg-gold' : 'left-0.5 bg-silver/30'
                        }`} />
                      </div>
                      <span className="font-body text-xs text-silver/60 group-hover:text-silver/80 transition-colors duration-200">Con pileta</span>
                    </label>
                  </div>

                  <div className="flex items-end">
                    {hasAdvancedFilters && (
                      <button onClick={clearAdvanced}
                        className="flex items-center gap-1.5 btn-gold-outline px-4 py-2.5 rounded-sm font-body text-xs w-full justify-center">
                        <X size={11} /> Limpiar filtros
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results counter */}
          <div className="flex items-center justify-between mb-8">
            <p className="font-body text-xs text-silver/30 tracking-widest uppercase">
              {filtered.length} {filtered.length === 1 ? 'propiedad' : 'propiedades'} encontradas
            </p>
            {(hasAdvancedFilters || filtroTipo !== 'todos') && (
              <button onClick={() => { clearAdvanced(); setFiltroTipo('todos') }}
                className="font-body text-xs text-gold/50 hover:text-gold tracking-wider uppercase transition-colors duration-200 flex items-center gap-1">
                <X size={10} /> Limpiar todo
              </button>
            )}
          </div>

          {/* Grid / List */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="font-display text-2xl font-300 text-white mb-2">Sin resultados</h3>
                <p className="font-body text-sm text-silver/40 tracking-wider mb-6">No hay propiedades que coincidan con los filtros seleccionados.</p>
                <button onClick={() => { clearAdvanced(); setFiltroTipo('todos') }} className="btn-gold px-6 py-3 rounded-sm text-xs">
                  Ver todas las propiedades
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${filtroTipo}-${vista}`}
                className={vista === 'grilla'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
                }
              >
                {filtered.map((p, i) => (
                  <PropertyCard
                    key={p.id}
                    propiedad={p}
                    onOpen={setSelected}
                    index={i}
                    vista={vista}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <p className="font-body text-silver/40 text-xs tracking-widest uppercase mb-4">
                ¿No encontrás lo que buscás?
              </p>
              <button
                onClick={() => document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gold-outline px-8 py-3.5 rounded-sm text-xs"
              >
                Consultar propiedad a medida
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <PropertyModal
            propiedad={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
