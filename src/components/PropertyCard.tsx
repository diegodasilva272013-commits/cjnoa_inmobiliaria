'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bed, Bath, Square, MapPin, Play, Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Propiedad, VistaTipo } from '@/types'
import { formatPrice, formatM2 } from '@/lib/utils'

interface Props {
  propiedad: Propiedad
  onOpen: (p: Propiedad) => void
  index: number
  vista?: VistaTipo
}

const ETIQUETA_CONFIG: Record<string, { label: string; color: string }> = {
  nuevo: { label: 'Nuevo', color: 'bg-sky-900/70 text-sky-300 border-sky-500/40' },
  oportunidad: { label: 'Oportunidad', color: 'bg-amber-900/70 text-amber-300 border-amber-500/40' },
  premium: { label: 'Premium', color: 'bg-violet-900/70 text-violet-300 border-violet-500/40' },
  rebajado: { label: 'Rebajado', color: 'bg-emerald-900/70 text-emerald-300 border-emerald-500/40' },
}

const TYPE_LABELS: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Dpto.',
  terreno: 'Terreno',
  local: 'Local',
  oficina: 'Oficina',
  country: 'Country',
}

export default function PropertyCard({ propiedad, onOpen, index, vista = 'grilla' }: Props) {
  const [hovered, setHovered] = useState(false)

  const isLista = vista === 'lista'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.1, 0.5), ease: [0.22, 1, 0.36, 1] }}
      className={`property-card relative bg-dark-3 rounded-sm overflow-hidden cursor-pointer group ${isLista ? 'flex' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(propiedad)}
    >
      {/* Image / Video container */}
      <div className={`relative overflow-hidden ${isLista ? 'w-32 sm:w-48 md:w-64 flex-shrink-0' : 'aspect-[4/3]'}`}>
        {/* Main photo */}
        <Image
          src={propiedad.fotos[0] || '/placeholder.jpg'}
          alt={propiedad.titulo}
          fill
          className={`object-cover transition-all duration-700 ${hovered ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Second photo on hover */}
        {propiedad.fotos[1] && (
          <Image
            src={propiedad.fotos[1]}
            alt={propiedad.titulo}
            fill
            className={`object-cover transition-all duration-700 ${hovered ? 'scale-105 opacity-100' : 'scale-110 opacity-0'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-card-gradient" />

        {/* Video play indicator */}
        {propiedad.video_url && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center backdrop-blur-sm"
          >
            <Play size={18} className="text-gold ml-1" fill="currentColor" />
          </motion.div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="bg-dark/80 backdrop-blur-sm border border-gold/20 text-gold text-[10px] font-700 tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm">
              {TYPE_LABELS[propiedad.tipo] || propiedad.tipo}
            </span>
            {propiedad.destacada && (
              <span className="btn-gold text-[10px] px-2.5 py-1 rounded-sm flex items-center gap-1 w-fit">
                <Star size={9} fill="currentColor" />
                Premium
              </span>
            )}
            {propiedad.etiqueta && ETIQUETA_CONFIG[propiedad.etiqueta] && (
              <span className={`text-[10px] font-700 tracking-widest uppercase px-2.5 py-1 rounded-sm border w-fit ${ETIQUETA_CONFIG[propiedad.etiqueta].color}`}>
                {ETIQUETA_CONFIG[propiedad.etiqueta].label}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-700 tracking-widest uppercase px-2.5 py-1 rounded-sm backdrop-blur-sm ${
            propiedad.estado === 'disponible' ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-500/30' :
            propiedad.estado === 'reservado' ? 'bg-amber-900/60 text-amber-400 border border-amber-500/30' :
            'bg-red-900/60 text-red-400 border border-red-500/30'
          }`}>
            {propiedad.estado}
          </span>
        </div>

        {/* Video watch button overlay */}
        <motion.div
          className="card-overlay absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center"
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        >
          <div className="flex items-center gap-2 text-xs text-gold/80 font-body tracking-wider uppercase font-600">
            <Play size={12} fill="currentColor" />
            Ver propiedad
          </div>
        </motion.div>
      </div>

      {/* Card content */}
      <div className={`p-5 ${isLista ? 'flex-1 flex flex-col justify-between' : ''}`}>
        {/* Location */}
        <div className="flex items-center gap-1.5 text-silver/50 mb-2">
          <MapPin size={11} />
          <span className="font-body text-xs tracking-wider uppercase">{propiedad.ciudad}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-500 text-white leading-tight mb-3 group-hover:text-gold/90 transition-colors duration-300">
          {propiedad.titulo}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4">
          {propiedad.habitaciones !== undefined && propiedad.habitaciones > 0 && (
            <div className="flex items-center gap-1.5 text-silver/60">
              <Bed size={12} />
              <span className="font-body text-xs">{propiedad.habitaciones}</span>
            </div>
          )}
          {propiedad.banos !== undefined && propiedad.banos > 0 && (
            <div className="flex items-center gap-1.5 text-silver/60">
              <Bath size={12} />
              <span className="font-body text-xs">{propiedad.banos}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-silver/60">
            <Square size={12} />
            <span className="font-body text-xs">{formatM2(propiedad.m2_totales)}</span>
          </div>
        </div>

        {/* Gold divider */}
        <div className="gold-divider mb-4" />

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-2xl font-600 text-gold-static">
              {formatPrice(propiedad.precio, propiedad.moneda)}
            </span>
          </div>
          <Link
            href={`/propiedades/${propiedad.id}`}
            onClick={e => e.stopPropagation()}
            className="btn-gold-outline px-4 py-2 rounded-sm text-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5"
          >
            Ver más <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
