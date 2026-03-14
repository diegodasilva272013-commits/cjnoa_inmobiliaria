'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, X, Phone } from 'lucide-react'

export default function VoiceAgent() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(false)
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID

  const startCall = () => {
    setActive(true)
    // When you have the ElevenLabs widget script loaded in layout,
    // it exposes window.ElevenLabsConvai.startSession({ agentId })
    if (typeof window !== 'undefined' && (window as any).ElevenLabsConvai) {
      (window as any).ElevenLabsConvai.startSession({ agentId })
    }
  }

  const endCall = () => {
    setActive(false)
    if (typeof window !== 'undefined' && (window as any).ElevenLabsConvai) {
      (window as any).ElevenLabsConvai.endSession()
    }
  }

  return (
    <div className="fixed bottom-32 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card rounded-sm p-5 w-72 mb-1"
          >
            {/* ElevenLabs widget embed point */}
            <div id="elevenlabs-widget" className="w-full" />

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-silver/30'}`} />
              <span className="font-body text-xs tracking-wider uppercase text-silver/60">
                {active ? 'Agente activo' : 'Asistente de voz IA'}
              </span>
            </div>

            {!active ? (
              <>
                <p className="font-body text-xs text-silver/40 leading-relaxed mb-4">
                  Hablá con nuestro asistente para consultar propiedades, precios y disponibilidad en tiempo real.
                </p>
                <button
                  onClick={startCall}
                  disabled={!agentId}
                  className="btn-gold w-full py-3 rounded-sm flex items-center justify-center gap-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Mic size={14} />
                  Iniciar llamada IA
                </button>
                {!agentId && (
                  <p className="text-center font-body text-[10px] text-silver/20 mt-2">
                    Configurá ELEVENLABS_AGENT_ID en .env.local
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gold rounded-full"
                      animate={{ height: [8, 24, 8] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.12 }}
                    />
                  ))}
                </div>
                <p className="font-body text-xs text-center text-silver/50 mb-4">
                  Escuchando... preguntá lo que necesitás
                </p>
                <button
                  onClick={endCall}
                  className="btn-gold-outline w-full py-3 rounded-sm flex items-center justify-center gap-2 text-xs border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <MicOff size={14} />
                  Finalizar llamada
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={`float-btn w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
          active
            ? 'bg-green-500 animate-pulse-ring'
            : 'bg-dark-4 border border-gold/25 hover:border-gold/60'
        }`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="Asistente de voz IA"
      >
        {open
          ? <X size={20} className="text-white" />
          : active
          ? <Phone size={20} className="text-white" />
          : <Mic size={20} className="text-gold" />
        }
      </motion.button>
    </div>
  )
}
