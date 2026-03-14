'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 120, suffix: '+', label: 'Propiedades Vendidas', description: 'En todo el NOA argentino' },
  { value: 15, suffix: '', label: 'Años de Experiencia', description: 'Respaldo jurídico garantizado' },
  { value: 98, suffix: '%', label: 'Clientes Satisfechos', description: 'Procesos exitosos' },
  { value: 500, suffix: 'M', label: 'USD en Transacciones', description: 'Gestionados con éxito' },
]

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 2000
    const steps = 60
    const inc = value / steps
    let current = 0
    const interval = setInterval(() => {
      current += inc
      if (current >= value) {
        setCount(value)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [active, value])

  return (
    <span className="stat-number text-4xl sm:text-5xl lg:text-6xl">
      {count.toLocaleString('es-AR')}{suffix}
    </span>
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="stats" ref={ref} className="relative py-24 bg-dark-2">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04)_0%,transparent_60%)]" />

      {/* Top/bottom gold lines */}
      <div className="gold-divider absolute top-0 left-0 right-0" />
      <div className="gold-divider absolute bottom-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col items-center text-center py-8 px-6 ${
                i < 3 ? 'lg:border-r border-r-gold/10' : ''
              }`}
            >
              <Counter value={stat.value} suffix={stat.suffix} active={inView} />
              <div className="font-body text-xs font-700 tracking-[0.25em] uppercase text-white/80 mt-3 mb-1">
                {stat.label}
              </div>
              <div className="font-body text-xs text-silver/40 tracking-wider">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
