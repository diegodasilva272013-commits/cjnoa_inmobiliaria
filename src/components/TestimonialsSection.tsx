'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonio {
  id: number
  nombre: string
  tipo_operacion: string
  texto: string
  calificacion: number
  iniciales: string
  color: string
}

const TESTIMONIOS: Testimonio[] = [
  {
    id: 1,
    nombre: 'Marcela Vargas',
    tipo_operacion: 'Compra de casa — Alto Gorriti',
    texto: 'El equipo de CJ NOA nos acompañó en cada paso de la compra. Desde la búsqueda hasta la firma de escritura, sentimos total seguridad y transparencia. Recomendamos sin dudarlo.',
    calificacion: 5,
    iniciales: 'MV',
    color: 'from-gold/20 to-gold/5',
  },
  {
    id: 2,
    nombre: 'Roberto Casas',
    tipo_operacion: 'Venta de departamento — Centro',
    texto: 'Vendí mi departamento en tiempo récord y al precio justo. El respaldo jurídico integrado del estudio es una ventaja enorme que no encontrás en otras inmobiliarias de Jujuy.',
    calificacion: 5,
    iniciales: 'RC',
    color: 'from-violet-500/15 to-violet-500/5',
  },
  {
    id: 3,
    nombre: 'Sofía Quispe',
    tipo_operacion: 'Inversión en country — San Antonio',
    texto: 'Buscaba una inversión segura y el equipo me orientó perfectamente. La propiedad que adquirí superó mis expectativas. El tour virtual fue clave para tomar la decisión.',
    calificacion: 5,
    iniciales: 'SQ',
    color: 'from-sky-500/15 to-sky-500/5',
  },
  {
    id: 4,
    nombre: 'Diego Aramayo',
    tipo_operacion: 'Alquiler de oficina — Área Central',
    texto: 'Profesionalismo de principio a fin. El proceso fue ágil y el contrato quedó impecable gracias al estudio jurídico. Muy buena experiencia, ya estoy pensando en la próxima operación.',
    calificacion: 5,
    iniciales: 'DA',
    color: 'from-emerald-500/15 to-emerald-500/5',
  },
  {
    id: 5,
    nombre: 'Claudia Flores',
    tipo_operacion: 'Compra de terreno — Yala',
    texto: 'El agente de voz me atendió a las 11 de la noche y respondió todas mis dudas sobre el terreno. Al día siguiente coordinamos la visita. Una experiencia realmente innovadora.',
    calificacion: 5,
    iniciales: 'CF',
    color: 'from-rose-500/15 to-rose-500/5',
  },
]

function StarRating({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < n ? 'text-gold' : 'text-silver/20'} fill={i < n ? 'currentColor' : 'none'} />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => setCurrent(c => (c + 1) % TESTIMONIOS.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + TESTIMONIOS.length) % TESTIMONIOS.length), [])

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(next, 5000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, next])

  const t = TESTIMONIOS[current]

  return (
    <section className="relative py-24 bg-dark-2 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,168,76,0.04)_0%,transparent_50%)]" />
      <div className="absolute top-1/2 left-0 w-48 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      <div className="absolute top-1/2 right-0 w-48 h-px bg-gradient-to-l from-transparent via-gold/10 to-transparent" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-gold/40" />
            <span className="section-tag">Clientes</span>
            <div className="h-px w-12 bg-gold/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl font-300 text-white"
          >
            Lo que dicen{' '}
            <span className="text-gold-shimmer font-600">nuestros clientes</span>
          </motion.h2>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`glass-card rounded-sm p-10 relative bg-gradient-to-br ${t.color}`}
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-8 font-display text-8xl text-gold/10 leading-none select-none pointer-events-none">"</div>

              {/* Stars */}
              <div className="mb-6">
                <StarRating n={t.calificacion} />
              </div>

              {/* Text */}
              <p className="font-body text-silver/80 text-base leading-relaxed mb-8 max-w-2xl relative z-10">
                "{t.texto}"
              </p>

              <div className="gold-divider mb-6" />

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} border border-gold/20 flex items-center justify-center flex-shrink-0`}>
                  <span className="font-display text-base font-600 text-gold-static">{t.iniciales}</span>
                </div>
                <div>
                  <div className="font-body text-sm font-600 text-white">{t.nombre}</div>
                  <div className="font-body text-xs text-silver/40 tracking-wider">{t.tipo_operacion}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrow controls */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-silver/40 hover:border-gold/40 hover:text-gold transition-all duration-200"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-silver/40 hover:border-gold/40 hover:text-gold transition-all duration-200"
            aria-label="Siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Testimonio ${i + 1}`}
            />
          ))}
        </div>

        {/* Pause indicator */}
        {paused && (
          <p className="text-center font-body text-[10px] text-silver/20 tracking-widest uppercase mt-3">Pausado</p>
        )}
      </div>
    </section>
  )
}
