'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Users, FileText } from 'lucide-react'
import Image from 'next/image'

const PILARES = [
  {
    icon: Shield,
    title: 'Respaldo Jurídico',
    desc: 'Cada transacción está respaldada por nuestros abogados especializados en derecho inmobiliario.',
  },
  {
    icon: Award,
    title: '15 Años de Experiencia',
    desc: 'Somos referentes en el mercado inmobiliario del Noroeste Argentino.',
  },
  {
    icon: Users,
    title: 'Atención Personalizada',
    desc: 'Un equipo dedicado exclusivamente a tu proceso de compra o venta.',
  },
  {
    icon: FileText,
    title: 'Trámites Completos',
    desc: 'Escrituración, due diligence, contratos y toda la gestión legal incluida.',
  },
]

export default function AboutSection() {
  return (
    <section id="nosotros" className="relative py-24 bg-dark-2 overflow-hidden">
      {/* BG decorations */}
      <div className="absolute top-0 left-0 right-0 gold-divider" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,168,76,0.04)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-gold/40" />
              <span className="section-tag">Quiénes Somos</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl font-300 text-white leading-tight mb-6"
            >
              El estudio que une{' '}
              <span className="text-gold-shimmer font-600">derecho</span>{' '}
              e{' '}
              <span className="text-gold-shimmer font-600">inmuebles</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-silver/55 text-sm leading-relaxed mb-8"
            >
              Centro Jurídico NOA nació en Jujuy con una visión clara: que comprar o vender 
              una propiedad sea un proceso seguro, transparente y exitoso para todos. 
              Combinamos el rigor jurídico de un estudio de primer nivel con la pasión 
              y conocimiento del mercado inmobiliario del NOA.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-body text-silver/40 text-sm leading-relaxed mb-10"
            >
              Nuestras operaciones abarcan San Salvador de Jujuy, Yala, Tilcara, Humahuaca 
              y toda la Quebrada. Somos la única empresa de la región que ofrece respaldo 
              legal integral en cada transacción, sin costo adicional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <button
                onClick={() => document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gold px-6 py-3.5 rounded-sm text-xs"
              >
                Conocer el equipo
              </button>
              <button
                onClick={() => document.querySelector('#propiedades')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gold-outline px-6 py-3.5 rounded-sm text-xs"
              >
                Ver propiedades
              </button>
            </motion.div>
          </div>

          {/* Right — Pillars grid */}
          <div className="grid grid-cols-2 gap-4">
            {PILARES.map((pilar, i) => (
              <motion.div
                key={pilar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                className="glass-card rounded-sm p-6 group hover:border-gold/25 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                  <pilar.icon size={18} className="text-gold" />
                </div>
                <h3 className="font-body text-sm font-700 tracking-wider uppercase text-white/80 mb-2">
                  {pilar.title}
                </h3>
                <p className="font-body text-xs text-silver/40 leading-relaxed">
                  {pilar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom: NOA territory tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="gold-divider mb-8" />
          <span className="font-display text-2xl sm:text-3xl font-300 text-silver/20 tracking-[0.3em] uppercase">
            Jujuy · Salta · Tucumán · Santiago del Estero
          </span>
        </motion.div>
      </div>
    </section>
  )
}
