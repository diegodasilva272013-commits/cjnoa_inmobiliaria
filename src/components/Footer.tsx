'use client'

import { motion } from 'framer-motion'
import { Instagram, Facebook, Linkedin, ArrowUp } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative bg-dark-2 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 rounded-sm overflow-hidden flex-shrink-0">
                <Image src="/CJNOALOGo.jpeg" alt="Centro Jurídico NOA" fill className="object-contain" />
              </div>
              <div>
                <div className="font-display text-xl font-600 text-white tracking-widest leading-none">
                  CENTRO JURÍDICO
                </div>
                <div className="font-body text-gold text-xs tracking-[0.5em] uppercase mt-0.5">NOA</div>
              </div>
            </div>
            <p className="font-body text-silver/35 text-xs leading-relaxed max-w-xs">
              El estudio jurídico inmobiliario más innovador del Noroeste Argentino. 
              Tecnología, diseño y respaldo legal en cada transacción.
            </p>
          </div>

          {/* Links */}
          <div className="md:text-center">
            <h4 className="section-tag mb-5">Navegación</h4>
            <ul className="space-y-3">
              {['Inicio', 'Propiedades', 'Nosotros', 'Contacto'].map((l) => (
                <li key={l}>
                  <button
                    onClick={() => document.querySelector(`#${l.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-body text-xs text-silver/40 hover:text-gold transition-colors duration-300 tracking-wider uppercase"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <h4 className="section-tag mb-5">Seguinos</h4>
            <div className="flex gap-3 md:justify-end">
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-sm border border-gold/15 flex items-center justify-center text-silver/40 hover:text-gold hover:border-gold/40 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="gold-divider mb-6" />

        <div className="flex items-center justify-between">
          <p className="font-body text-[11px] text-silver/20 tracking-wider">
            © {new Date().getFullYear()} Centro Jurídico NOA · Todos los derechos reservados
          </p>
          <button
            onClick={scrollTop}
            className="w-9 h-9 rounded-sm border border-gold/20 flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold/50 transition-all duration-300"
            aria-label="Volver arriba"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
