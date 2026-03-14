'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit2, Trash2, Eye, Star, StarOff, Upload,
  X, Check, ChevronDown, Lock, LayoutDashboard,
  Users, Calendar, LogOut, Image as ImageIcon, Link
} from 'lucide-react'
import { MOCK_PROPIEDADES, formatPrice } from '@/lib/utils'
import type { Propiedad } from '@/types'
import Image from 'next/image'
import NextLink from 'next/link'

const EMPTY_PROPIEDAD: Omit<Propiedad, 'id' | 'created_at'> = {
  titulo: '', descripcion: '', descripcion_corta: '',
  precio: 0, moneda: 'USD', ubicacion: '', ciudad: '', barrio: '',
  tipo: 'casa', m2_totales: 0, m2_cubiertos: 0,
  habitaciones: 0, banos: 0, cochera: false, pileta: false,
  fotos: [], video_url: '', estado: 'disponible',
  destacada: false, amenidades: [], año_construccion: undefined,
  expensas: undefined, etiqueta: undefined,
}

const ESTADO_COLORS = {
  disponible: 'bg-emerald-900/60 text-emerald-400 border-emerald-500/30',
  reservado: 'bg-amber-900/60 text-amber-400 border-amber-500/30',
  vendido: 'bg-red-900/60 text-red-400 border-red-500/30',
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<'propiedades' | 'agenda'>('propiedades')
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [agendas, setAgendas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editando, setEditando] = useState<Propiedad | null>(null)
  const [form, setForm] = useState<Omit<Propiedad, 'id' | 'created_at'>>(EMPTY_PROPIEDAD)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewCard, setPreviewCard] = useState(false)
  const [amenidadesText, setAmenidadesText] = useState('')
  const [fotosUrls, setFotosUrls] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAuth = () => {
    const pwd = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'cjnoa2024'
    if (password === pwd) { setAuth(true); loadData() }
    else setAuthError('Contraseña incorrecta')
  }

  const loadData = async () => {
    setLoading(true)
    try {
      setPropiedades(MOCK_PROPIEDADES)
      const res = await fetch('/api/agenda')
      const json = await res.json()
      setAgendas(json.agendas || [])
    } catch {
      // no-op
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setEditando(null)
    setForm(EMPTY_PROPIEDAD)
    setAmenidadesText('')
    setFotosUrls('')
    setPreviewCard(false)
    setShowForm(true)
  }

  const openEdit = (p: Propiedad) => {
    setEditando(p)
    setForm({ ...p })
    setAmenidadesText((p.amenidades || []).join('\n'))
    setFotosUrls((p.fotos || []).join('\n'))
    setPreviewCard(false)
    setShowForm(true)
  }

  const savePropiedad = async () => {
    const fotos = fotosUrls.split('\n').map(s => s.trim()).filter(Boolean)
    const amenidades = amenidadesText.split('\n').map(s => s.trim()).filter(Boolean)
    const data = { ...form, fotos, amenidades }

    if (editando) {
      setPropiedades(prev => prev.map(p => p.id === editando.id ? { ...p, ...data } : p))
    } else {
      setPropiedades(prev => [{ ...data, id: Date.now().toString(), created_at: new Date().toISOString() }, ...prev])
    }
    setShowForm(false)
  }

  const deletePropiedad = async (id: string) => {
    setPropiedades(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  const toggleDestacada = async (p: Propiedad) => {
    setPropiedades(prev => prev.map(x => x.id === p.id ? { ...x, destacada: !x.destacada } : x))
  }

  const changeEstado = async (p: Propiedad, estado: Propiedad['estado']) => {
    setPropiedades(prev => prev.map(x => x.id === p.id ? { ...x, estado } : x))
  }

  const uploadFotos = async (files: FileList) => {
    setUploading(true)
    const urls = Array.from(files).map(f => URL.createObjectURL(f))
    setFotosUrls(prev => [...prev.split('\n').filter(Boolean), ...urls].join('\n'))
    setUploading(false)
  }

  if (!auth) return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm glass-card rounded-sm p-8" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-gold/70" />
          </div>
          <h1 className="font-display text-2xl font-400 text-white">Panel Admin</h1>
          <p className="font-body text-xs text-silver/40 tracking-widest uppercase mt-1">Centro Jurídico NOA</p>
        </div>
        <div className="space-y-3">
          <input
            type="password" placeholder="Contraseña" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
          {authError && <p className="text-red-400 text-xs font-body">{authError}</p>}
          <button onClick={handleAuth} className="btn-gold w-full py-3.5 rounded-sm text-xs">Ingresar</button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark">
      {/* Top nav */}
      <div className="glass-nav px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-display text-lg font-400 text-white">Admin <span className="text-gold-static">NOA</span></h1>
          <div className="flex items-center gap-1">
            {[
              { id: 'propiedades', label: 'Propiedades', icon: <LayoutDashboard size={14} /> },
              { id: 'agenda', label: 'Agenda', icon: <Calendar size={14} /> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs tracking-widest uppercase transition-all duration-200 ${tab === t.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-silver/40 hover:text-silver/70'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NextLink href="/admin/leads" className="btn-gold-outline flex items-center gap-2 px-4 py-2 rounded-sm text-xs">
            <Users size={14} /> Leads
          </NextLink>
          <button onClick={() => setAuth(false)} className="flex items-center gap-2 text-silver/30 hover:text-gold transition-colors duration-200 text-xs font-body">
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── PROPIEDADES TAB ── */}
        {tab === 'propiedades' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl font-300 text-white">Propiedades</h2>
                <p className="font-body text-xs text-silver/40 tracking-widest uppercase mt-1">{propiedades.length} propiedades en total</p>
              </div>
              <button onClick={openNew} className="btn-gold flex items-center gap-2 px-5 py-3 rounded-sm text-xs">
                <Plus size={15} /> Nueva propiedad
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
            ) : (
              <div className="space-y-3">
                {propiedades.map(p => (
                  <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-card rounded-sm p-4 flex items-center gap-4">
                    {/* Thumb */}
                    <div className="relative w-20 h-16 rounded-sm overflow-hidden flex-shrink-0">
                      {p.fotos?.[0] ? (
                        <Image src={p.fotos[0]} alt={p.titulo} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full bg-dark-4 flex items-center justify-center"><ImageIcon size={16} className="text-silver/20" /></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-body text-sm font-600 text-white truncate">{p.titulo}</h3>
                        {p.destacada && <Star size={12} className="text-gold flex-shrink-0" fill="currentColor" />}
                      </div>
                      <p className="font-body text-xs text-silver/40 truncate">{p.ubicacion}</p>
                    </div>

                    {/* Price */}
                    <div className="hidden sm:block flex-shrink-0">
                      <span className="font-display text-base font-600 text-gold-static">{formatPrice(p.precio, p.moneda)}</span>
                    </div>

                    {/* Estado selector */}
                    <div className="flex-shrink-0">
                      <select value={p.estado} onChange={e => changeEstado(p, e.target.value as Propiedad['estado'])}
                        className={`luxury-input text-[10px] font-700 tracking-widest uppercase px-2.5 py-1.5 rounded-sm border cursor-pointer ${ESTADO_COLORS[p.estado]}`}>
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleDestacada(p)} title={p.destacada ? 'Quitar de destacados' : 'Destacar'}
                        className={`w-8 h-8 rounded-sm border flex items-center justify-center transition-all duration-200 ${p.destacada ? 'border-gold/40 text-gold bg-gold/10' : 'border-white/10 text-silver/30 hover:border-gold/30 hover:text-gold'}`}>
                        {p.destacada ? <Star size={13} fill="currentColor" /> : <StarOff size={13} />}
                      </button>
                      <NextLink href={`/propiedades/${p.id}`} target="_blank"
                        className="w-8 h-8 rounded-sm border border-white/10 flex items-center justify-center text-silver/30 hover:border-gold/30 hover:text-gold transition-all duration-200">
                        <Eye size={13} />
                      </NextLink>
                      <button onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-sm border border-white/10 flex items-center justify-center text-silver/30 hover:border-gold/30 hover:text-gold transition-all duration-200">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)}
                        className="w-8 h-8 rounded-sm border border-white/10 flex items-center justify-center text-silver/30 hover:border-red-500/40 hover:text-red-400 transition-all duration-200">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AGENDA TAB ── */}
        {tab === 'agenda' && (
          <div>
            <h2 className="font-display text-3xl font-300 text-white mb-6">Citas Agendadas</h2>
            <div className="space-y-3">
              {agendas.length === 0 && <p className="font-body text-sm text-silver/30 text-center py-10">No hay citas agendadas aún.</p>}
              {agendas.map((a) => (
                <div key={a.id} className="glass-card rounded-sm p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
                  <div>
                    <div className="font-body text-[10px] text-silver/40 uppercase tracking-wider mb-0.5">Persona</div>
                    <div className="font-body text-sm text-white">{a.nombre}</div>
                  </div>
                  <div>
                    <div className="font-body text-[10px] text-silver/40 uppercase tracking-wider mb-0.5">Fecha</div>
                    <div className="font-body text-xs text-white">{new Date(a.fecha + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit' })} {a.horario}</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-body text-[10px] text-silver/40 uppercase tracking-wider mb-0.5">Tipo</div>
                    <div className="font-body text-xs text-white capitalize">{a.tipo}</div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-body text-[10px] text-silver/40 uppercase tracking-wider mb-0.5">Propiedad</div>
                    <div className="font-body text-xs text-white truncate">{a.propiedades?.titulo || '—'}</div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="font-body text-[10px] text-silver/40 uppercase tracking-wider mb-0.5">Teléfono</div>
                    <div className="font-body text-xs text-white">{a.telefono}</div>
                  </div>
                  <div>
                    <span className={`text-[10px] font-700 tracking-widest uppercase px-2.5 py-1.5 rounded-sm border ${
                      a.estado === 'confirmada' ? 'bg-emerald-900/60 text-emerald-400 border-emerald-500/30' :
                      a.estado === 'cancelada' ? 'bg-red-900/60 text-red-400 border-red-500/30' :
                      'bg-silver/10 text-silver/60 border-silver/20'
                    }`}>{a.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FORM DRAWER ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/80 backdrop-blur-sm flex justify-end">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl h-full overflow-y-auto"
              style={{ background: 'var(--black-3)', borderLeft: '1px solid rgba(201,168,76,0.12)' }}>
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
                style={{ background: 'var(--black-3)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                <h2 className="font-display text-2xl font-400 text-white">{editando ? 'Editar propiedad' : 'Nueva propiedad'}</h2>
                <button onClick={() => setShowForm(false)}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-silver/40 hover:text-gold hover:border-gold/30 transition-all duration-200">
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5">
                {/* Basic info */}
                <div className="space-y-3">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Título *</label>
                  <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
                    placeholder="Título de la propiedad" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                </div>

                <div className="space-y-3">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Descripción corta</label>
                  <input value={form.descripcion_corta} onChange={e => setForm({ ...form, descripcion_corta: e.target.value })}
                    placeholder="Descripción breve para la card" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                </div>

                <div className="space-y-3">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Descripción completa</label>
                  <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Descripción detallada..." rows={4}
                    className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm resize-none" />
                </div>

                {/* Price & type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Precio *</label>
                    <input type="number" value={form.precio || ''} onChange={e => setForm({ ...form, precio: Number(e.target.value) })}
                      placeholder="0" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Moneda</label>
                    <select value={form.moneda} onChange={e => setForm({ ...form, moneda: e.target.value as 'USD' | 'ARS' })}
                      className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm">
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Tipo</label>
                    <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as Propiedad['tipo'] })}
                      className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm">
                      {['casa','departamento','terreno','local','oficina','country'].map(t => (
                        <option key={t} value={t} className="capitalize">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Etiqueta</label>
                    <select value={form.etiqueta || ''} onChange={e => setForm({ ...form, etiqueta: e.target.value as Propiedad['etiqueta'] || undefined })}
                      className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm">
                      <option value="">Sin etiqueta</option>
                      <option value="nuevo">Nuevo</option>
                      <option value="oportunidad">Oportunidad</option>
                      <option value="premium">Premium</option>
                      <option value="rebajado">Rebajado</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Ciudad</label>
                    <input value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })}
                      placeholder="Ej: San Salvador de Jujuy" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Barrio</label>
                    <input value={form.barrio || ''} onChange={e => setForm({ ...form, barrio: e.target.value })}
                      placeholder="Barrio o zona" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Dirección / Ubicación</label>
                  <input value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })}
                    placeholder="Dirección completa para el mapa" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'm2_totales', label: 'M² Totales' },
                    { key: 'm2_cubiertos', label: 'M² Cubiertos' },
                    { key: 'habitaciones', label: 'Dormitorios' },
                    { key: 'banos', label: 'Baños' },
                    { key: 'año_construccion', label: 'Año const.' },
                    { key: 'expensas', label: 'Expensas ($)' },
                  ].map(f => (
                    <div key={f.key} className="space-y-2">
                      <label className="font-body text-xs text-silver/50 uppercase tracking-widest">{f.label}</label>
                      <input type="number" value={(form as any)[f.key] || ''}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="0" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                    </div>
                  ))}
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6">
                  {[
                    { key: 'cochera', label: 'Cochera' },
                    { key: 'pileta', label: 'Pileta' },
                    { key: 'destacada', label: 'Destacada' },
                  ].map(f => (
                    <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                      <div onClick={() => setForm({ ...form, [f.key]: !(form as any)[f.key] })}
                        className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${(form as any)[f.key] ? 'border-gold bg-gold/20' : 'border-white/20'}`}>
                        {(form as any)[f.key] && <Check size={11} className="text-gold" />}
                      </div>
                      <span className="font-body text-sm text-silver/60">{f.label}</span>
                    </label>
                  ))}
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Estado</label>
                  <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value as Propiedad['estado'] })}
                    className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm">
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>

                {/* Fotos */}
                <div className="space-y-3">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Fotos (una URL por línea)</label>
                  <textarea value={fotosUrls} onChange={e => setFotosUrls(e.target.value)}
                    placeholder="https://..." rows={4} className="luxury-input w-full px-4 py-3 rounded-sm font-body text-xs resize-none" />
                  <div className="flex items-center gap-3">
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                      onChange={e => e.target.files && uploadFotos(e.target.files)} />
                    <button onClick={() => fileInputRef.current?.click()}
                      className="btn-gold-outline flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs" disabled={uploading}>
                      <Upload size={13} /> {uploading ? 'Subiendo...' : 'Subir fotos'}
                    </button>
                    <span className="font-body text-xs text-silver/30">O pegá las URLs arriba</span>
                  </div>
                  {/* Mini preview */}
                  {fotosUrls.split('\n').filter(Boolean).length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {fotosUrls.split('\n').filter(Boolean).map((url, i) => (
                        <div key={i} className="relative w-16 h-12 flex-shrink-0 rounded-sm overflow-hidden">
                          <Image src={url} alt="" fill className="object-cover" sizes="64px" onError={() => {}} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video */}
                <div className="space-y-2">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest flex items-center gap-2"><Link size={12} /> URL de Video</label>
                  <input value={form.video_url || ''} onChange={e => setForm({ ...form, video_url: e.target.value })}
                    placeholder="https://... (Veo 3, YouTube o MP4)" className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm" />
                </div>

                {/* Amenidades */}
                <div className="space-y-2">
                  <label className="font-body text-xs text-silver/50 uppercase tracking-widest">Amenidades (una por línea)</label>
                  <textarea value={amenidadesText} onChange={e => setAmenidadesText(e.target.value)}
                    placeholder="Pileta&#10;Seguridad 24hs&#10;Quincho..." rows={4}
                    className="luxury-input w-full px-4 py-3 rounded-sm font-body text-sm resize-none" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-gold-outline px-5 py-3.5 rounded-sm text-xs">Cancelar</button>
                  <button onClick={savePropiedad} className="btn-gold flex-1 py-3.5 rounded-sm text-xs">
                    {editando ? 'Guardar cambios' : 'Publicar propiedad'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm glass-card rounded-sm p-6 text-center" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
              <div className="w-12 h-12 rounded-full bg-red-900/40 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="font-display text-xl font-400 text-white mb-2">¿Eliminar propiedad?</h3>
              <p className="font-body text-sm text-silver/50 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-gold-outline flex-1 py-3 rounded-sm text-xs">Cancelar</button>
                <button onClick={() => deletePropiedad(deleteConfirm)}
                  className="flex-1 py-3 rounded-sm text-xs font-body font-700 tracking-widest uppercase bg-red-900/60 text-red-400 border border-red-500/30 hover:bg-red-900/80 transition-all duration-200">
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
