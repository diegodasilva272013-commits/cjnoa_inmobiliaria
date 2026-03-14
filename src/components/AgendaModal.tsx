'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Video, Phone, MapPin, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getWhatsAppUrl } from '@/lib/utils'
import type { Agenda } from '@/types'

interface Props {
  propiedadId?: string
  propiedadTitulo?: string
  onClose: () => void
}

const TIPOS = [
  { value: 'visita', label: 'Visita Presencial', icon: <MapPin size={16} /> },
  { value: 'videollamada', label: 'Videollamada', icon: <Video size={16} /> },
  { value: 'llamada', label: 'Llamada Telefónica', icon: <Phone size={16} /> },
] as const

const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

function getProximos30Dias(): Date[] {
  const dias: Date[] = []
  const hoy = new Date()
  for (let i = 1; i <= 45 && dias.length < 30; i++) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    if (d.getDay() !== 0) dias.push(d) // sin domingos
  }
  return dias
}

function formatFecha(d: Date): string {
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function toISO(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function AgendaModal({ propiedadId, propiedadTitulo, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [tipo, setTipo] = useState<'visita' | 'videollamada' | 'llamada'>('visita')
  const [fechaIdx, setFechaIdx] = useState<number | null>(null)
  const [horario, setHorario] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [calPage, setCalPage] = useState(0)

  const dias = getProximos30Dias()
  const diasPorPagina = 7
  const diasVisible = dias.slice(calPage * diasPorPagina, (calPage + 1) * diasPorPagina)

  const confirmar = async () => {
    if (!nombre || !telefono || fechaIdx === null || !horario) return
    setLoading(true)
    setError('')
    try {
      const agenda: Omit<Agenda, 'id' | 'created_at'> = {
        nombre,
        telefono,
        email: email || undefined,
        tipo,
        propiedad_id: propiedadId,
        fecha: toISO(dias[fechaIdx]),
        horario,
        estado: 'confirmada',
      }
      const { error: sbError } = await supabase.from('agenda').insert([agenda])
      if (sbError) console.error('Supabase error:', sbError)

      // WhatsApp confirmation
      const fechaStr = formatFecha(dias[fechaIdx])
      const tipoLabel = TIPOS.find(t => t.value === tipo)?.label || tipo
      const msg = `✅ *Confirmación de cita - CJ NOA*\n\nHola ${nombre}! Tu cita ha sido confirmada:\n\n📅 Fecha: ${fechaStr}\n🕐 Horario: ${horario} hs\n📋 Tipo: ${tipoLabel}${propiedadTitulo ? `\n🏠 Propiedad: ${propiedadTitulo}` : ''}\n\nNuestro equipo se pondrá en contacto para confirmar todos los detalles. ¡Hasta pronto!`
      const waUrl = getWhatsAppUrl(msg)
      window.open(waUrl, '_blank')

      setStep(4)
    } catch (e) {
      console.error(e)
      setError('Ocurrió un error. Por favor intentá nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg glass-card rounded-sm overflow-hidden"
        style={{ border: '1px solid rgba(201,168,76,0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-6 bg-gold/40" />
              <span className="section-tag">Reservar Cita</span>
            </div>
            <h2 className="font-display text-2xl font-400 text-white">Agendá tu visita</h2>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-dark/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/30 transition-all duration-200">
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex px-6 pt-4 gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-gold' : 'bg-white/10'}`} />
            ))}
          </div>
        )}

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {/* STEP 1 — Tipo */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <p className="font-body text-xs text-silver/50 tracking-widest uppercase mb-4">Paso 1 — Tipo de cita</p>
                <div className="space-y-3 mb-6">
                  {TIPOS.map(t => (
                    <button key={t.value} onClick={() => setTipo(t.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-sm border transition-all duration-200 ${tipo === t.value ? 'border-gold/60 bg-gold/5' : 'border-white/8 hover:border-gold/20'}`}>
                      <div className={`${tipo === t.value ? 'text-gold' : 'text-silver/40'} transition-colors duration-200`}>{t.icon}</div>
                      <span className={`font-body text-sm font-500 ${tipo === t.value ? 'text-white' : 'text-silver/60'} transition-colors duration-200`}>{t.label}</span>
                      {tipo === t.value && <div className="ml-auto w-4 h-4 rounded-full bg-gold flex items-center justify-center"><Check size={9} className="text-dark" /></div>}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="btn-gold w-full py-3.5 rounded-sm text-xs">Continuar</button>
              </motion.div>
            )}

            {/* STEP 2 — Fecha y horario */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <p className="font-body text-xs text-silver/50 tracking-widest uppercase mb-4">Paso 2 — Fecha y horario</p>

                {/* Calendar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setCalPage(p => Math.max(0, p - 1))} disabled={calPage === 0}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-silver/40 hover:text-gold hover:border-gold/30 disabled:opacity-20 transition-all duration-200">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="font-body text-xs text-silver/50 tracking-widest uppercase">Seleccioná una fecha</span>
                    <button onClick={() => setCalPage(p => p + 1)} disabled={(calPage + 1) * diasPorPagina >= dias.length}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-silver/40 hover:text-gold hover:border-gold/30 disabled:opacity-20 transition-all duration-200">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {diasVisible.map((d, i) => {
                      const realIdx = calPage * diasPorPagina + i
                      const selected = fechaIdx === realIdx
                      return (
                        <button key={i} onClick={() => setFechaIdx(realIdx)}
                          className={`flex flex-col items-center py-2 px-1 rounded-sm border transition-all duration-200 ${selected ? 'border-gold bg-gold/10' : 'border-white/8 hover:border-gold/30'}`}>
                          <span className={`font-body text-[9px] uppercase tracking-wider ${selected ? 'text-gold' : 'text-silver/40'}`}>
                            {d.toLocaleDateString('es-AR', { weekday: 'short' })}
                          </span>
                          <span className={`font-body text-sm font-600 mt-0.5 ${selected ? 'text-gold' : 'text-white/70'}`}>{d.getDate()}</span>
                          <span className={`font-body text-[9px] ${selected ? 'text-gold/70' : 'text-silver/30'}`}>
                            {d.toLocaleDateString('es-AR', { month: 'short' })}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Horarios */}
                <div className="mb-5">
                  <p className="font-body text-xs text-silver/40 tracking-widest uppercase mb-3">Horario disponible</p>
                  <div className="grid grid-cols-5 gap-2">
                    {HORARIOS.map(h => (
                      <button key={h} onClick={() => setHorario(h)}
                        className={`py-2 rounded-sm border text-xs font-body font-600 transition-all duration-200 ${horario === h ? 'border-gold bg-gold/10 text-gold' : 'border-white/8 text-silver/50 hover:border-gold/30'}`}>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-gold-outline px-5 py-3 rounded-sm text-xs">Atrás</button>
                  <button onClick={() => setStep(3)} disabled={fechaIdx === null || !horario}
                    className="btn-gold flex-1 py-3 rounded-sm text-xs disabled:opacity-40">Continuar</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Datos personales */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <p className="font-body text-xs text-silver/50 tracking-widest uppercase mb-4">Paso 3 — Tus datos</p>

                {/* Summary */}
                {fechaIdx !== null && horario && (
                  <div className="glass-card rounded-sm p-3 mb-5 flex items-center gap-3">
                    <Calendar size={14} className="text-gold/60 flex-shrink-0" />
                    <span className="font-body text-xs text-silver/60">
                      {formatFecha(dias[fechaIdx])} a las {horario} hs — {TIPOS.find(t => t.value === tipo)?.label}
                    </span>
                  </div>
                )}

                <div className="space-y-3 mb-5">
                  <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo"
                    className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                  <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono / WhatsApp" type="tel"
                    className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (opcional)" type="email"
                    className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                </div>

                {error && <p className="text-red-400 text-xs font-body mb-3">{error}</p>}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-gold-outline px-5 py-3 rounded-sm text-xs">Atrás</button>
                  <button onClick={confirmar} disabled={loading || !nombre || !telefono}
                    className="btn-gold flex-1 py-3 rounded-sm text-xs disabled:opacity-40">
                    {loading ? 'Confirmando...' : 'Confirmar cita'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Confirmación */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                className="text-center py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-emerald-400" />
                </motion.div>
                <h3 className="font-display text-2xl font-400 text-white mb-2">¡Cita confirmada!</h3>
                {fechaIdx !== null && horario && (
                  <div className="glass-card rounded-sm p-4 my-5 text-left space-y-2">
                    <div className="flex justify-between"><span className="font-body text-xs text-silver/40 uppercase tracking-wider">Fecha</span><span className="font-body text-xs text-white">{formatFecha(dias[fechaIdx])}</span></div>
                    <div className="flex justify-between"><span className="font-body text-xs text-silver/40 uppercase tracking-wider">Horario</span><span className="font-body text-xs text-white">{horario} hs</span></div>
                    <div className="flex justify-between"><span className="font-body text-xs text-silver/40 uppercase tracking-wider">Tipo</span><span className="font-body text-xs text-white">{TIPOS.find(t => t.value === tipo)?.label}</span></div>
                    {propiedadTitulo && <div className="flex justify-between"><span className="font-body text-xs text-silver/40 uppercase tracking-wider">Propiedad</span><span className="font-body text-xs text-white truncate ml-4">{propiedadTitulo}</span></div>}
                  </div>
                )}
                <p className="font-body text-sm text-silver/50 mb-6">Recibirás la confirmación por WhatsApp. Nuestro equipo te contactará para coordinar los detalles finales.</p>
                <button onClick={onClose} className="btn-gold px-8 py-3 rounded-sm text-xs">Cerrar</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
