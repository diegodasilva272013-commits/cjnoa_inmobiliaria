'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')

  const send = () => {
    const text = msg.trim() || 'Hola! Visité su sitio web y me gustaría consultar sobre propiedades disponibles.'
    window.open(getWhatsAppUrl(text), '_blank')
    setOpen(false)
    setMsg('')
  }

  return (
    <div className="fixed bottom-10 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card rounded-sm w-72 overflow-hidden mb-1"
          >
            {/* Header */}
            <div className="bg-[#128C7E] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={14} className="text-white" />
              </div>
              <div>
                <div className="font-body text-xs font-700 text-white">Centro Jurídico NOA</div>
                <div className="font-body text-[10px] text-white/70">Respuesta en minutos</div>
              </div>
            </div>

            {/* Chat bubble */}
            <div className="p-4 bg-dark-4">
              <div className="bg-dark-3 rounded-sm rounded-tl-none px-3 py-2.5 mb-4 border border-white/5">
                <p className="font-body text-xs text-silver/70 leading-relaxed">
                  ¡Hola! 👋 Soy el asistente de CJ NOA. ¿En qué puedo ayudarte hoy?
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Escribí tu mensaje..."
                  className="luxury-input flex-1 rounded-sm px-3 py-2.5 text-xs"
                />
                <button
                  onClick={send}
                  className="w-10 h-10 rounded-sm bg-[#25D366] flex items-center justify-center hover:bg-[#128C7E] transition-colors duration-200 flex-shrink-0"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="float-btn w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="WhatsApp"
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
      </motion.button>
    </div>
  )
}
