'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Play, Pause,
  Volume2, VolumeX, Maximize2, Minimize2, MapPin, Bed,
  Bath, Square, Car, Waves, Calendar, Phone, MessageCircle,
  Check, Star, ChevronDown, ChevronUp, Home
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getPropiedad } from '@/lib/supabase'
import { MOCK_PROPIEDADES, formatPrice, formatM2, getPropertyWhatsApp, getWhatsAppUrl } from '@/lib/utils'
import type { Propiedad } from '@/types'
import AgendaModal from '@/components/AgendaModal'

const TYPE_LABELS: Record<string, string> = {
  casa: 'Casa', departamento: 'Departamento', terreno: 'Terreno',
  local: 'Local Comercial', oficina: 'Oficina', country: 'Country',
}

const ETIQUETA_CONFIG = {
  nuevo: { label: 'NUEVO', color: 'bg-blue-900/70 text-blue-300 border-blue-500/30' },
  oportunidad: { label: 'OPORTUNIDAD', color: 'bg-emerald-900/70 text-emerald-300 border-emerald-500/30' },
  premium: { label: 'PREMIUM', color: 'bg-amber-900/70 text-amber-300 border-amber-500/30' },
  rebajado: { label: 'REBAJADO', color: 'bg-red-900/70 text-red-300 border-red-500/30' },
}

function getFAQs(p: Propiedad) {
  return [
    {
      q: '¿Cuáles son los gastos adicionales al precio de venta?',
      a: `Los gastos de escritura, sellado provincial e impuestos de transferencia rondan el 3–4% del valor de la propiedad. Nuestro equipo jurídico te asesora en cada paso sin costo adicional.`,
    },
    {
      q: '¿Se puede financiar la compra?',
      a: `Sí, trabajamos con los principales bancos de la provincia para créditos hipotecarios. También gestionamos financiación directa en casos seleccionados. Consultanos tu situación particular.`,
    },
    {
      q: `¿Cuánto tiempo toma el proceso de compra de esta ${TYPE_LABELS[p.tipo] || 'propiedad'}?`,
      a: `El proceso completo, desde la reserva hasta la escritura, lleva entre 30 y 60 días hábiles, dependiendo del tipo de operación y la disponibilidad de documentación.`,
    },
    {
      q: '¿Puedo agendar una visita antes de decidir?',
      a: `Por supuesto. Podés agendar visitas de lunes a sábados de 9 a 18 hs, de forma presencial o por videollamada. Hacé click en "Agendar visita" para reservar tu turno.`,
    },
    {
      q: '¿La propiedad tiene deudas de ABL o expensas?',
      a: `Todas las propiedades listadas en CJ NOA cuentan con certificado de libre deuda verificado por nuestro estudio jurídico antes de la publicación.`,
    },
  ]
}

export default function PropiedadPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null)
  const [relacionadas, setRelacionadas] = useState<Propiedad[]>([])
  const [loading, setLoading] = useState(true)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const p = await getPropiedad(id)
        setPropiedad(p)
        // related
        const all = MOCK_PROPIEDADES.filter(x => x.id !== id && (x.tipo === p.tipo || x.ciudad === p.ciudad)).slice(0, 3)
        setRelacionadas(all)
      } catch {
        const mock = MOCK_PROPIEDADES.find(p => p.id === id)
        if (mock) {
          setPropiedad(mock)
          const rel = MOCK_PROPIEDADES.filter(x => x.id !== id && (x.tipo === mock.tipo || x.ciudad === mock.ciudad)).slice(0, 3)
          setRelacionadas(rel)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!propiedad) return
      if (e.key === 'ArrowRight') setPhotoIdx(i => (i + 1) % propiedad.fotos.length)
      if (e.key === 'ArrowLeft') setPhotoIdx(i => (i - 1 + propiedad.fotos.length) % propiedad.fotos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [propiedad])

  const toggleVideo = () => {
    if (!videoRef.current) return
    if (videoPlaying) { videoRef.current.pause(); setVideoPlaying(false) }
    else { videoRef.current.play(); setVideoPlaying(true) }
  }

  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return
    if (!document.fullscreenElement) {
      await videoContainerRef.current.requestFullscreen()
      setFullscreen(true)
    } else {
      await document.exitFullscreen()
      setFullscreen(false)
    }
  }

  // Touch/swipe support
  const touchStart = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null || !propiedad) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) setPhotoIdx(i => (i + 1) % propiedad.fotos.length)
      else setPhotoIdx(i => (i - 1 + propiedad.fotos.length) % propiedad.fotos.length)
    }
    touchStart.current = null
  }

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  )

  if (!propiedad) return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6">
      <p className="font-body text-silver/50 tracking-widest uppercase text-sm">Propiedad no encontrada</p>
      <Link href="/" className="btn-gold-outline px-6 py-3 rounded-sm text-xs">Volver al inicio</Link>
    </div>
  )

  const faqs = getFAQs(propiedad)
  const whatsappMsg = getPropertyWhatsApp(propiedad.titulo, propiedad.precio, propiedad.moneda)

  return (
    <div className="min-h-screen bg-dark">
      {/* Fixed top nav */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-nav px-4 sm:px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-silver/60 hover:text-gold transition-colors duration-200 font-body text-xs tracking-widest uppercase">
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Volver al catálogo</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="font-display text-sm text-white/70 hidden sm:inline">{propiedad.titulo}</span>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-silver/40 hover:text-gold transition-colors duration-200">
          <Home size={15} />
          <span className="font-body text-xs tracking-widest uppercase hidden sm:inline">Inicio</span>
        </Link>
      </div>

      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── GALLERY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4 rounded-sm overflow-hidden">
          {/* Main photo */}
          <div
            className="lg:col-span-3 relative aspect-[4/3] lg:aspect-auto lg:h-[480px] overflow-hidden cursor-pointer"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div key={photoIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                <Image src={propiedad.fotos[photoIdx]} alt={propiedad.titulo} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 60vw" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent pointer-events-none" />

            {/* Nav arrows */}
            {propiedad.fotos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx(i => (i - 1 + propiedad.fotos.length) % propiedad.fotos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:text-gold hover:border-gold/40 transition-all duration-200">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setPhotoIdx(i => (i + 1) % propiedad.fotos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:text-gold hover:border-gold/40 transition-all duration-200">
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-dark/70 backdrop-blur-sm px-3 py-1.5 rounded-sm text-xs text-silver/60 font-body tracking-wider">
              {photoIdx + 1} / {propiedad.fotos.length}
            </div>

            {/* Video button */}
            {propiedad.video_url && (
              <button onClick={() => setShowVideo(true)}
                className="absolute bottom-4 left-4 flex items-center gap-2 bg-gold/20 border border-gold/50 backdrop-blur-sm text-gold text-xs font-body tracking-widest uppercase px-4 py-2 rounded-sm hover:bg-gold/30 transition-all duration-200">
                <Play size={12} fill="currentColor" /> Ver video tour
              </button>
            )}

            {/* Etiqueta */}
            {propiedad.etiqueta && ETIQUETA_CONFIG[propiedad.etiqueta] && (
              <div className={`absolute top-4 left-4 border text-[10px] font-700 tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm backdrop-blur-sm ${ETIQUETA_CONFIG[propiedad.etiqueta].color}`}>
                {ETIQUETA_CONFIG[propiedad.etiqueta].label}
              </div>
            )}
          </div>

          {/* Side photos */}
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-3 lg:h-[480px]">
            {propiedad.fotos.slice(1, 5).map((foto, i) => (
              <div key={i} className="relative overflow-hidden cursor-pointer group lg:flex-1"
                style={{ height: '112px' }}
                onClick={() => setPhotoIdx(i + 1)}>
                <Image src={foto} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 50vw, 20vw" />
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-transparent transition-colors duration-300" />
                {i === 3 && propiedad.fotos.length > 5 && (
                  <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
                    <span className="font-body text-white text-sm font-600">+{propiedad.fotos.length - 5}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {propiedad.fotos.map((foto, i) => (
            <button key={i} onClick={() => setPhotoIdx(i)}
              className={`relative flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden transition-all duration-200 ${i === photoIdx ? 'ring-2 ring-gold' : 'opacity-40 hover:opacity-70'}`}>
              <Image src={foto} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT — Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="btn-gold text-[10px] px-3 py-1.5 rounded-sm tracking-widest">{TYPE_LABELS[propiedad.tipo]}</span>
                {propiedad.destacada && (
                  <span className="flex items-center gap-1 text-[10px] text-gold/70 border border-gold/20 px-2.5 py-1.5 rounded-sm tracking-widest uppercase font-600 font-body">
                    <Star size={9} fill="currentColor" /> Premium
                  </span>
                )}
                <span className={`text-[10px] font-700 tracking-widest uppercase px-2.5 py-1.5 rounded-sm backdrop-blur-sm ${
                  propiedad.estado === 'disponible' ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-500/30' :
                  propiedad.estado === 'reservado' ? 'bg-amber-900/60 text-amber-400 border border-amber-500/30' :
                  'bg-red-900/60 text-red-400 border border-red-500/30'
                }`}>{propiedad.estado}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-400 text-white leading-tight mb-3">{propiedad.titulo}</h1>

              <div className="flex items-center gap-2 text-silver/50">
                <MapPin size={14} className="text-gold/60" />
                <span className="font-body text-sm tracking-wider">{propiedad.ubicacion}</span>
              </div>
            </div>

            {/* Ficha técnica */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold/40" />
                <span className="section-tag">Ficha Técnica</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Square size={18} />, label: 'M² Totales', value: formatM2(propiedad.m2_totales) },
                  ...(propiedad.m2_cubiertos ? [{ icon: <Square size={18} />, label: 'M² Cubiertos', value: formatM2(propiedad.m2_cubiertos) }] : []),
                  ...(propiedad.habitaciones ? [{ icon: <Bed size={18} />, label: 'Dormitorios', value: String(propiedad.habitaciones) }] : []),
                  ...(propiedad.banos ? [{ icon: <Bath size={18} />, label: 'Baños', value: String(propiedad.banos) }] : []),
                  ...(propiedad.cochera !== undefined ? [{ icon: <Car size={18} />, label: 'Cochera', value: propiedad.cochera ? 'Sí' : 'No' }] : []),
                  ...(propiedad.pileta !== undefined ? [{ icon: <Waves size={18} />, label: 'Pileta', value: propiedad.pileta ? 'Sí' : 'No' }] : []),
                  ...(propiedad.año_construccion ? [{ icon: <Calendar size={18} />, label: 'Año const.', value: String(propiedad.año_construccion) }] : []),
                  ...(propiedad.expensas ? [{ icon: <span className="text-base">$</span>, label: 'Expensas', value: formatPrice(propiedad.expensas, 'ARS') }] : []),
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-sm p-4 flex items-center gap-3">
                    <div className="text-gold/60">{item.icon}</div>
                    <div>
                      <div className="font-body text-[10px] text-silver/40 tracking-widest uppercase">{item.label}</div>
                      <div className="font-body text-sm font-600 text-white">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold/40" />
                <span className="section-tag">Descripción</span>
              </div>
              <p className="font-body text-silver/60 text-sm leading-relaxed">{propiedad.descripcion}</p>
            </div>

            {/* Amenidades */}
            {propiedad.amenidades && propiedad.amenidades.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-gold/40" />
                  <span className="section-tag">Beneficios Destacados</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {propiedad.amenidades.map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 glass-card px-4 py-3 rounded-sm">
                      <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-gold" />
                      </div>
                      <span className="font-body text-sm text-silver/70">{a}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold/40" />
                <span className="section-tag">Ubicación</span>
              </div>
              <div className="rounded-sm overflow-hidden border border-gold/10 h-[300px]">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(propiedad.ubicacion)}&zoom=14`}
                  className="w-full h-full filter grayscale"
                />
              </div>
              <p className="font-body text-xs text-silver/40 mt-2 tracking-wider">
                <MapPin size={11} className="inline mr-1" />{propiedad.ubicacion}
              </p>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold/40" />
                <span className="section-tag">Preguntas Frecuentes</span>
              </div>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="glass-card rounded-sm overflow-hidden">
                    <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/2 transition-colors duration-200">
                      <span className="font-body text-sm text-white/80 pr-4">{faq.q}</span>
                      <div className="flex-shrink-0 text-gold/60">
                        {openFAQ === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openFAQ === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                          <div className="px-5 pb-4 border-t border-gold/10">
                            <p className="font-body text-sm text-silver/50 leading-relaxed pt-3">{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Sticky actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <div className="glass-card rounded-sm p-6">
                <div className="font-body text-[10px] text-silver/40 tracking-[0.3em] uppercase mb-1">Precio</div>
                <div className="font-display text-4xl font-600 text-gold-static mb-1">
                  {formatPrice(propiedad.precio, propiedad.moneda)}
                </div>
                {propiedad.moneda === 'USD' && (
                  <div className="font-body text-xs text-silver/30 tracking-wider">Dólares estadounidenses</div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <a href={getWhatsAppUrl(whatsappMsg)} target="_blank" rel="noopener noreferrer"
                  className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-sm text-xs">
                  <MessageCircle size={15} /> Consultar por WhatsApp
                </a>

                <button onClick={() => setAgendaOpen(true)}
                  className="btn-gold-outline w-full flex items-center justify-center gap-2 py-4 rounded-sm text-xs">
                  <Calendar size={15} /> Agendar visita
                </button>

                <a href={`tel:${process.env.NEXT_PUBLIC_PHONE || '+54388400000'}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm text-xs font-body font-600 tracking-[0.2em] uppercase text-silver/40 border border-white/5 hover:border-gold/20 hover:text-gold/60 transition-all duration-300">
                  <Phone size={14} /> Solicitar llamada
                </a>
              </div>

              {/* Legal badge */}
              <div className="glass-card rounded-sm p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={13} className="text-gold" />
                </div>
                <div>
                  <div className="font-body text-xs text-white/70 font-600 mb-1">Respaldo Jurídico</div>
                  <div className="font-body text-xs text-silver/40 leading-relaxed">Documentación verificada y libre de deudas por nuestro estudio jurídico.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PROPERTIES ── */}
        {relacionadas.length > 0 && (
          <div className="mt-20">
            <div className="gold-divider mb-12" />
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-10 bg-gold/40" />
                <span className="section-tag">También te puede interesar</span>
                <div className="h-px w-10 bg-gold/40" />
              </div>
              <h2 className="font-display text-3xl font-300 text-white">Propiedades <span className="text-gold-shimmer font-600">Relacionadas</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionadas.map((p) => (
                <Link key={p.id} href={`/propiedades/${p.id}`}
                  className="property-card glass-card rounded-sm overflow-hidden group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={p.fotos[0]} alt={p.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="font-display text-base font-500 text-white">{p.titulo}</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-display text-xl font-600 text-gold-static">{formatPrice(p.precio, p.moneda)}</span>
                    <span className="text-[10px] font-body font-600 tracking-widest text-silver/40 uppercase">{TYPE_LABELS[p.tipo]}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── VIDEO FULLSCREEN OVERLAY ── */}
      <AnimatePresence>
        {showVideo && propiedad.video_url && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-sm flex items-center justify-center">
            <button onClick={() => { setShowVideo(false); setVideoPlaying(false) }}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-dark/80 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/40 transition-all duration-200 z-10">
              <Minimize2 size={18} />
            </button>
            <div ref={videoContainerRef} className="relative w-full max-w-5xl mx-6 aspect-video bg-black rounded-sm overflow-hidden">
              {(() => {
                const url = propiedad.video_url!
                // YouTube
                const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
                if (ytMatch) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  )
                }
                // Archivo local o URL directa mp4
                return (
                  <>
                    <video
                      ref={videoRef}
                      src={url}
                      className="w-full h-full object-contain bg-black"
                      playsInline
                      muted={muted}
                      onEnded={() => setVideoPlaying(false)}
                      onPlay={() => setVideoPlaying(true)}
                      onPause={() => setVideoPlaying(false)}
                    />
                    {/* Controles */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex items-center gap-3">
                      <button onClick={toggleVideo} className="w-11 h-11 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold/30 transition-all duration-200">
                        {videoPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </button>
                      <button onClick={() => setMuted(!muted)} className="w-9 h-9 rounded-full bg-dark/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold transition-colors duration-200">
                        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                      <div className="flex-1" />
                      <button onClick={toggleFullscreen} className="w-9 h-9 rounded-full bg-dark/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold transition-colors duration-200">
                        {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                      </button>
                    </div>
                    {/* Play central si está pausado */}
                    {!videoPlaying && (
                      <button onClick={toggleVideo}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/60 flex items-center justify-center backdrop-blur-sm hover:bg-gold/25 transition-all duration-200">
                        <Play size={28} className="text-gold ml-2" fill="currentColor" />
                      </button>
                    )}
                  </>
                )
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agenda Modal */}
      <AnimatePresence>
        {agendaOpen && (
          <AgendaModal propiedadId={propiedad.id} propiedadTitulo={propiedad.titulo} onClose={() => setAgendaOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
