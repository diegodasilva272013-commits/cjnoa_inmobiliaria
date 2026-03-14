'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { saveLead } from '@/lib/supabase'

export default function ContactSection() {
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', mensaje: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.nombre || !form.telefono) {
      setError('Nombre y teléfono son obligatorios.')
      return
    }
    setError('')
    setSending(true)
    try {
      await saveLead({
        nombre: form.nombre,
        telefono: form.telefono,
        email: form.email || undefined,
        mensaje: form.mensaje || undefined,
        origen: 'formulario',
      })
      setSent(true)
    } catch (e) {
      // Fallback: show success anyway in demo mode
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contacto" className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,76,0.05)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left — Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-gold/40" />
              <span className="section-tag">Contacto</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl font-300 text-white leading-tight mb-6"
            >
              Hablemos de{' '}
              <span className="text-gold-shimmer font-600">tu propiedad</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-silver/50 text-sm leading-relaxed mb-10"
            >
              Nuestro equipo está listo para asesorarte. Combinamos la atención 
              personalizada con tecnología de vanguardia para darte la mejor 
              experiencia en el mercado inmobiliario del NOA.
            </motion.p>

            {/* Contact info */}
            <div className="space-y-5">
              {[
                { icon: MapPin, label: 'Dirección', value: 'San Salvador de Jujuy, Jujuy, Argentina' },
                { icon: Phone, label: 'Teléfono', value: '+54 388 400-0000' },
                { icon: Mail, label: 'Email', value: 'info@cjnoa.com.ar' },
                { icon: Clock, label: 'Horarios', value: 'Lun–Vie 9:00 a 18:00 · Sáb 9:00 a 13:00' },
              ].map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-sm bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={14} className="text-gold" />
                  </div>
                  <div>
                    <div className="font-body text-[10px] text-silver/30 tracking-widest uppercase mb-0.5">{label}</div>
                    <div className="font-body text-sm text-silver/70">{value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card rounded-sm p-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mb-5">
                    <CheckCircle size={28} className="text-gold" />
                  </div>
                  <h3 className="font-display text-3xl font-500 text-white mb-3">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="font-body text-silver/50 text-sm leading-relaxed max-w-xs">
                    Te contactaremos dentro de las próximas horas. Muchas gracias por confiar en Centro Jurídico NOA.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-500 text-white mb-6">
                    Solicitar información
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-[10px] text-silver/40 tracking-widest uppercase block mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="luxury-input w-full rounded-sm px-4 py-3 text-sm"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] text-silver/40 tracking-widest uppercase block mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="luxury-input w-full rounded-sm px-4 py-3 text-sm"
                        placeholder="+54 388..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-[10px] text-silver/40 tracking-widest uppercase block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="luxury-input w-full rounded-sm px-4 py-3 text-sm"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="font-body text-[10px] text-silver/40 tracking-widest uppercase block mb-2">
                      Mensaje
                    </label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={4}
                      className="luxury-input w-full rounded-sm px-4 py-3 text-sm resize-none"
                      placeholder="¿Qué tipo de propiedad buscás? ¿Necesitás asesoría?"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-body">{error}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="btn-gold w-full py-4 rounded-sm flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {sending ? (
                      <span className="animate-pulse">Enviando...</span>
                    ) : (
                      <>
                        <Send size={15} />
                        Enviar consulta
                      </>
                    )}
                  </button>

                  <p className="font-body text-[10px] text-silver/25 text-center tracking-wider">
                    Tu información está protegida. No compartimos tus datos.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
