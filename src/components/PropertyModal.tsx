'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight,
  MessageCircle, Phone, Star, Check, Calendar
} from 'lucide-react'
import Image from 'next/image'
import type { Propiedad } from '@/types'
import { formatPrice, formatM2, getPropertyWhatsApp, getWhatsAppUrl } from '@/lib/utils'

interface Props {
  propiedad: Propiedad
  onClose: () => void
}

export default function PropertyModal({ propiedad, onClose }: Props) {
  const [tab, setTab] = useState<'fotos' | 'video' | 'detalles'>('fotos')
  const [photoIdx, setPhotoIdx] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photoIdx])

  const nextPhoto = () => setPhotoIdx((i) => (i + 1) % propiedad.fotos.length)
  const prevPhoto = () => setPhotoIdx((i) => (i - 1 + propiedad.fotos.length) % propiedad.fotos.length)

  const toggleVideo = () => {
    if (!videoRef.current) return
    if (videoPlaying) { videoRef.current.pause(); setVideoPlaying(false) }
    else { videoRef.current.play(); setVideoPlaying(true) }
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setFullscreen(true)
    } else {
      await document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const whatsappMsg = getPropertyWhatsApp(propiedad.titulo, propiedad.precio, propiedad.moneda)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] modal-backdrop flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full sm:max-w-6xl max-h-[92vh] bg-dark-3 rounded-t-xl sm:rounded-sm overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row"
        style={{ border: '1px solid rgba(201,168,76,0.15)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-dark/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/40 transition-all duration-300"
        >
          <X size={18} />
        </button>

        {/* LEFT — Media */}
        <div className="lg:w-[58%] flex flex-col bg-dark-2">
          {/* Tabs */}
          <div className="flex border-b border-white/5 px-1 pt-1 gap-1">
            {(['fotos', ...(propiedad.video_url ? ['video'] : []), 'detalles'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as typeof tab)}
                className={`px-4 py-3 text-xs font-body font-600 tracking-[0.2em] uppercase transition-all duration-300 relative ${
                  tab === t ? 'text-gold' : 'text-silver/40 hover:text-silver/70'
                }`}
              >
                {t === 'fotos' ? 'Galería' : t === 'video' ? '▶ Video Tour' : 'Detalles'}
                {tab === t && (
                  <motion.div layoutId="modal-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>

          {/* FOTOS TAB */}
          {tab === 'fotos' && (
            <div className="relative flex-1 min-h-0 flex flex-col">
              {/* Main photo */}
              <div className="relative flex-1 min-h-[280px] lg:min-h-0 overflow-hidden">
                <Image
                  src={propiedad.fotos[photoIdx]}
                  alt={propiedad.titulo}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-3/60 to-transparent" />

                {/* Nav arrows */}
                {propiedad.fotos.length > 1 && (
                  <>
                    <button onClick={prevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:text-gold hover:border-gold/40 transition-all duration-200">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:text-gold hover:border-gold/40 transition-all duration-200">
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Counter */}
                <div className="absolute bottom-3 right-3 bg-dark/60 backdrop-blur-sm px-3 py-1 rounded-sm text-xs text-silver/60 font-body tracking-wider">
                  {photoIdx + 1} / {propiedad.fotos.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-1.5 p-3 overflow-x-auto bg-dark-4">
                {propiedad.fotos.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIdx(i)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden transition-all duration-200 ${
                      i === photoIdx ? 'ring-2 ring-gold' : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image src={foto} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIDEO TAB */}
          {tab === 'video' && (
            <div ref={containerRef} className="relative flex-1 min-h-[300px] bg-dark flex items-center justify-center">
              {propiedad.video_url ? (
                <>
                  <video
                    ref={videoRef}
                    src={propiedad.video_url}
                    className="w-full h-full object-cover"
                    loop
                    muted={muted}
                    playsInline
                    onEnded={() => setVideoPlaying(false)}
                  />
                  <div className="video-gradient-overlay absolute inset-0" />

                  {/* Video controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <button onClick={toggleVideo}
                      className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold/30 transition-all duration-200">
                      {videoPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </button>
                    <button onClick={() => setMuted(!muted)}
                      className="w-8 h-8 rounded-full bg-dark/40 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold transition-colors duration-200">
                      {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <div className="flex-1" />
                    <button onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-full bg-dark/40 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold transition-colors duration-200">
                      {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>

                  {/* Play overlay when paused */}
                  {!videoPlaying && (
                    <button onClick={toggleVideo}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/60 flex items-center justify-center animate-pulse-ring">
                      <Play size={28} className="text-gold ml-2" fill="currentColor" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-silver/30">
                  <Play size={48} />
                  <span className="font-body text-sm tracking-wider uppercase">Video próximamente</span>
                  <span className="font-body text-xs text-silver/20">Grabado con Veo 3</span>
                </div>
              )}
            </div>
          )}

          {/* DETALLES TAB (mobile only extra info) */}
          {tab === 'detalles' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="section-tag mb-3">Descripción completa</h4>
                <p className="font-body text-silver/60 text-sm leading-relaxed">{propiedad.descripcion}</p>
              </div>
              {propiedad.amenidades && propiedad.amenidades.length > 0 && (
                <div>
                  <h4 className="section-tag mb-3">Amenidades</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {propiedad.amenidades.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-silver/60">
                        <Check size={12} className="text-gold flex-shrink-0" />
                        <span className="font-body text-xs">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Info */}
        <div className="lg:w-[42%] lg:overflow-y-auto flex flex-col">
          <div className="p-6 flex-1">
            {/* Status + Type */}
            <div className="flex items-center gap-2 mb-4">
              <span className="btn-gold text-[10px] px-3 py-1.5 rounded-sm tracking-widest">
                {propiedad.tipo.toUpperCase()}
              </span>
              {propiedad.destacada && (
                <span className="flex items-center gap-1 text-[10px] text-gold/70 border border-gold/20 px-2.5 py-1.5 rounded-sm tracking-widest uppercase font-600">
                  <Star size={9} fill="currentColor" /> Premium
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl lg:text-3xl font-500 text-white leading-tight mb-2">
              {propiedad.titulo}
            </h2>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-silver/50 mb-6">
              <MapPin size={13} />
              <span className="font-body text-xs tracking-wider">{propiedad.ubicacion}</span>
            </div>

            {/* Price */}
            <div className="glass-card rounded-sm p-4 mb-6">
              <span className="font-body text-xs text-silver/40 tracking-widest uppercase block mb-1">Precio</span>
              <span className="font-display text-4xl font-700 text-gold-static">
                {formatPrice(propiedad.precio, propiedad.moneda)}
              </span>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {propiedad.habitaciones !== undefined && propiedad.habitaciones > 0 && (
                <div className="glass-card rounded-sm p-3 text-center">
                  <Bed size={16} className="text-gold mx-auto mb-1" />
                  <div className="font-display text-xl font-600 text-white">{propiedad.habitaciones}</div>
                  <div className="font-body text-[10px] text-silver/40 tracking-wider uppercase">Hab.</div>
                </div>
              )}
              {propiedad.banos !== undefined && propiedad.banos > 0 && (
                <div className="glass-card rounded-sm p-3 text-center">
                  <Bath size={16} className="text-gold mx-auto mb-1" />
                  <div className="font-display text-xl font-600 text-white">{propiedad.banos}</div>
                  <div className="font-body text-[10px] text-silver/40 tracking-wider uppercase">Baños</div>
                </div>
              )}
              <div className="glass-card rounded-sm p-3 text-center">
                <Square size={16} className="text-gold mx-auto mb-1" />
                <div className="font-display text-xl font-600 text-white">{propiedad.m2_totales}</div>
                <div className="font-body text-[10px] text-silver/40 tracking-wider uppercase">m² tot.</div>
              </div>
            </div>

            {/* Short description */}
            <p className="font-body text-sm text-silver/55 leading-relaxed mb-6">
              {propiedad.descripcion_corta}
            </p>

            {/* Amenidades */}
            {propiedad.amenidades && propiedad.amenidades.length > 0 && (
              <div className="mb-6">
                <h4 className="section-tag mb-3">Amenidades incluidas</h4>
                <div className="flex flex-wrap gap-2">
                  {propiedad.amenidades.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 text-[11px] font-body text-silver/60 border border-white/8 bg-white/3 px-2.5 py-1 rounded-sm">
                      <Check size={10} className="text-gold" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra details */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {propiedad.cochera && (
                <div className="flex items-center gap-2 text-silver/50 text-xs font-body">
                  <Check size={11} className="text-gold" /> Cochera
                </div>
              )}
              {propiedad.pileta && (
                <div className="flex items-center gap-2 text-silver/50 text-xs font-body">
                  <Check size={11} className="text-gold" /> Pileta
                </div>
              )}
              {propiedad.año_construccion && (
                <div className="flex items-center gap-2 text-silver/50 text-xs font-body">
                  <Calendar size={11} className="text-gold" /> Año {propiedad.año_construccion}
                </div>
              )}
              {propiedad.m2_cubiertos && (
                <div className="flex items-center gap-2 text-silver/50 text-xs font-body">
                  <Square size={11} className="text-gold" /> {formatM2(propiedad.m2_cubiertos)} cub.
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="p-6 border-t border-white/5 space-y-3">
            <a
              href={getWhatsAppUrl(whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full btn-gold py-4 rounded-sm text-sm"
            >
              <MessageCircle size={16} />
              Consultar por WhatsApp
            </a>
            <a
              href="tel:+543884000000"
              className="flex items-center justify-center gap-3 w-full btn-gold-outline py-4 rounded-sm text-xs"
            >
              <Phone size={14} />
              Llamar al estudio
            </a>
            <p className="text-center font-body text-[10px] text-silver/25 tracking-wider">
              Centro Jurídico NOA · Operación segura garantizada
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
