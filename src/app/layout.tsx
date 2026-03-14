import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Centro Jurídico NOA | Propiedades Premium en Jujuy',
  description: 'Las mejores propiedades del Noroeste Argentino. Compra, venta y asesoría jurídica en bienes raíces. Centro Jurídico NOA — San Salvador de Jujuy.',
  keywords: ['inmuebles jujuy', 'propiedades jujuy', 'casas jujuy', 'real estate noa', 'centro juridico noa', 'comprar casa jujuy'],
  openGraph: {
    title: 'Centro Jurídico NOA | Propiedades Premium',
    description: 'Las mejores propiedades del Noroeste Argentino con respaldo jurídico',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${montserrat.variable} bg-dark text-white antialiased`}>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
