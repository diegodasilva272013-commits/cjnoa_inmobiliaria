import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Propiedad } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(precio: number, moneda: 'USD' | 'ARS'): string {
  if (moneda === 'USD') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio)
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio)
}

export function formatM2(m2: number): string {
  return `${m2.toLocaleString('es-AR')} m²`
}

export function getWhatsAppUrl(mensaje: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493884000000'
  return `https://wa.me/${number}?text=${encodeURIComponent(mensaje)}`
}

export function getPropertyWhatsApp(titulo: string, precio: number, moneda: 'USD' | 'ARS'): string {
  return `Hola! Me interesa la propiedad *${titulo}* publicada en CJ NOA con precio ${formatPrice(precio, moneda)}. ¿Podrían darme más información?`
}

// ── MOCK DATA (hasta conectar Supabase real) ──────────────────────────────────
export const MOCK_PROPIEDADES: Propiedad[] = [
  {
    id: '1',
    titulo: 'Residencia Premium Alto Gorriti',
    descripcion: 'Espectacular residencia de lujo ubicada en el exclusivo barrio Alto Gorriti. Esta propiedad representa lo mejor de la arquitectura contemporánea fusionada con la calidez del NOA. Amplios espacios integrados, materiales de primera calidad, y vistas panorámicas a los cerros que rodean Jujuy. El diseño interior fue desarrollado por un reconocido arquitecto local, combinando la estética regional con el confort moderno. Cuenta con domótica completa, sistema de seguridad perimetral y jardines diseñados por paisajistas profesionales.',
    descripcion_corta: 'Residencia de lujo con vistas panorámicas a los cerros de Jujuy.',
    precio: 285000,
    moneda: 'USD',
    ubicacion: 'Alto Gorriti, San Salvador de Jujuy',
    barrio: 'Alto Gorriti',
    ciudad: 'San Salvador de Jujuy',
    tipo: 'casa',
    m2_totales: 480,
    m2_cubiertos: 320,
    habitaciones: 5,
    banos: 4,
    cochera: true,
    pileta: true,
    fotos: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600',
    ],
    video_url: '/Inmobiliara Roca.mp4',
    estado: 'disponible',
    destacada: true,
    amenidades: ['Pileta olímpica', 'Domótica', 'Seguridad 24hs', 'Quincho', 'Sauna', 'Jardín landscaped'],
    año_construccion: 2022,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    titulo: 'Penthouse Exclusivo Centro Histórico',
    descripcion: 'Penthouse de diseño único en el corazón histórico de Jujuy. Terraza privada de 120m² con vistas 360° a la ciudad y la Quebrada. Interiorismo de lujo con materiales importados, cocina gourmet totalmente equipada, y espacio de trabajo integrado. A pasos de los principales puntos culturales y gastronómicos de la ciudad.',
    descripcion_corta: 'Penthouse único con terraza y vistas 360° a la ciudad.',
    precio: 195000,
    moneda: 'USD',
    ubicacion: 'Centro Histórico, San Salvador de Jujuy',
    barrio: 'Centro',
    ciudad: 'San Salvador de Jujuy',
    tipo: 'departamento',
    m2_totales: 280,
    m2_cubiertos: 160,
    habitaciones: 3,
    banos: 3,
    cochera: true,
    pileta: false,
    fotos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600',
    ],
    video_url: '/Inmobiliaria Verde.mp4',
    estado: 'disponible',
    destacada: true,
    amenidades: ['Terraza privada 120m²', 'Vista panorámica', 'Cocina gourmet', 'Seguridad'],
    año_construccion: 2023,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    titulo: 'Villa Privada en Countries Jujuy',
    descripcion: 'Imponente villa dentro del complejo privado más exclusivo de Jujuy. Arquitectura de autor inspirada en la Puna, con materiales autóctonos como piedra laja y madera de cardón. Amplias galerías perimetrales, parrilla con horno de barro, y conexión directa con la naturaleza desde cada ambiente.',
    descripcion_corta: 'Villa privada en country exclusivo con arquitectura de autor.',
    precio: 420000,
    moneda: 'USD',
    ubicacion: 'Countries Jujuy, Yala',
    barrio: 'Yala',
    ciudad: 'Yala',
    tipo: 'country',
    m2_totales: 650,
    m2_cubiertos: 400,
    habitaciones: 6,
    banos: 5,
    cochera: true,
    pileta: true,
    fotos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1600',
    ],
    video_url: '',
    estado: 'disponible',
    destacada: true,
    amenidades: ['Country 24hs', 'Pileta + hidromasaje', 'Cancha de tenis', 'Parrilla premium', 'Quincho'],
    año_construccion: 2021,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    titulo: 'Loft Industrial Chic San Pedrito',
    descripcion: 'Espectacular loft en edificio reciclado con estética industrial de vanguardia. Doble altura, ventanales de piso a techo, hormigón visto y acero. Ambiente único que combina el pasado industrial de Jujuy con el diseño contemporáneo más innovador.',
    descripcion_corta: 'Loft de doble altura con estética industrial y ventanales de piso a techo.',
    precio: 98000,
    moneda: 'USD',
    ubicacion: 'San Pedrito, San Salvador de Jujuy',
    barrio: 'San Pedrito',
    ciudad: 'San Salvador de Jujuy',
    tipo: 'departamento',
    m2_totales: 120,
    m2_cubiertos: 120,
    habitaciones: 1,
    banos: 2,
    cochera: true,
    pileta: false,
    fotos: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1600',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1600',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600',
    ],
    video_url: '',
    estado: 'disponible',
    destacada: false,
    amenidades: ['Doble altura', 'Ventanales panorámicos', 'Hormigón visto'],
    año_construccion: 2023,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    titulo: 'Casa Estilo NOA con Quebrada View',
    descripcion: 'Propiedad de diseño arquitectónico regional con vistas privilegiadas a la Quebrada de Humahuaca. Materiales autóctonos de primera calidad: adobe, madera de cardón, y piedra puna. Perfecta integración entre arquitectura vernácula y comodidades modernas.',
    descripcion_corta: 'Arquitectura regional de autor con vistas a la Quebrada de Humahuaca.',
    precio: 175000,
    moneda: 'USD',
    ubicacion: 'Tilcara, Jujuy',
    barrio: 'Tilcara',
    ciudad: 'Tilcara',
    tipo: 'casa',
    m2_totales: 350,
    m2_cubiertos: 220,
    habitaciones: 4,
    banos: 3,
    cochera: false,
    pileta: true,
    fotos: [
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1600',
      'https://images.unsplash.com/photo-1598228723793-42e3a4c2b61e?w=1600',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1600',
    ],
    video_url: '',
    estado: 'disponible',
    destacada: false,
    amenidades: ['Vista Quebrada', 'Arquitectura regional', 'Pileta', 'Huerta orgánica'],
    año_construccion: 2020,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    titulo: 'Oficinas Premium Torre Empresarial',
    descripcion: 'Planta completa en el edificio corporativo más exclusivo de Jujuy. Instalaciones de última generación, salas de reunión, terraza compartida y amenities empresariales. Ideal para estudios jurídicos, consultoras y empresas de primer nivel.',
    descripcion_corta: 'Planta completa en torre corporativa premium en el corazón de Jujuy.',
    precio: 155000,
    moneda: 'USD',
    ubicacion: 'Microcentro, San Salvador de Jujuy',
    barrio: 'Microcentro',
    ciudad: 'San Salvador de Jujuy',
    tipo: 'oficina',
    m2_totales: 200,
    m2_cubiertos: 200,
    habitaciones: 0,
    banos: 3,
    cochera: true,
    pileta: false,
    fotos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600',
    ],
    video_url: '',
    estado: 'disponible',
    destacada: false,
    amenidades: ['Sala de reuniones', 'Cocina ejecutiva', 'Estacionamiento', 'Seguridad 24hs'],
    año_construccion: 2022,
    created_at: new Date().toISOString(),
  },
]
