# 🏢 Centro Jurídico NOA — Web de Inmuebles Premium

## ⚡ Setup rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Editá el archivo `.env.local` con tus datos reales:
```
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=tu_agent_id
NEXT_PUBLIC_WHATSAPP_NUMBER=5493884XXXXXXX
```

### 3. Crear tablas en Supabase
Ejecutá este SQL en el SQL Editor de Supabase:

```sql
create table propiedades (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  descripcion_corta text,
  precio numeric not null,
  moneda text default 'USD',
  ubicacion text,
  barrio text,
  ciudad text,
  tipo text,
  m2_totales numeric,
  m2_cubiertos numeric,
  habitaciones int,
  banos int,
  cochera boolean default false,
  pileta boolean default false,
  video_url text,
  fotos text[] default '{}',
  estado text default 'disponible',
  destacada boolean default false,
  amenidades text[],
  año_construccion int,
  expensas numeric,
  created_at timestamp with time zone default now()
);

create table leads (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  telefono text not null,
  email text,
  propiedad_id uuid references propiedades(id),
  origen text default 'web',
  mensaje text,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS y políticas de lectura pública
alter table propiedades enable row level security;
alter table leads enable row level security;

create policy "Propiedades públicas" on propiedades
  for select using (true);

create policy "Insertar leads" on leads
  for insert with check (true);
```

### 4. Correr en desarrollo
```bash
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000)

### 5. Deploy en Vercel
```bash
npm install -g vercel
vercel --prod
```

---

## 🏗 Estructura del proyecto
```
src/
├── app/
│   ├── layout.tsx        → Layout global con fuentes y metadata
│   ├── page.tsx          → Página principal
│   └── globals.css       → Sistema de diseño premium
├── components/
│   ├── Navbar.tsx        → Navegación con glass morphism
│   ├── Hero.tsx          → Hero épico con partículas y typewriter
│   ├── StatsSection.tsx  → Estadísticas con contadores animados
│   ├── PropertiesSection → Grid de propiedades con filtros
│   ├── PropertyCard.tsx  → Card con preview de foto/video en hover
│   ├── PropertyModal.tsx → Modal fullscreen con galería y video
│   ├── AboutSection.tsx  → Sección nosotros
│   ├── ContactSection.tsx→ Formulario que guarda en Supabase
│   ├── Footer.tsx        → Footer premium
│   ├── VoiceAgent.tsx    → Botón flotante ElevenLabs
│   ├── WhatsAppButton.tsx→ WhatsApp flotante
│   └── CustomCursor.tsx  → Cursor personalizado con gold
├── lib/
│   ├── supabase.ts       → Cliente Supabase + queries
│   └── utils.ts          → Helpers + mock data
└── types/
    └── index.ts          → TypeScript types
```

## 🎨 Stack tecnológico
- **Next.js 14** + App Router
- **Framer Motion** — animaciones cinematográficas
- **Tailwind CSS** — sistema de diseño custom
- **Supabase** — base de datos + storage
- **ElevenLabs** — agente de voz IA
- **TypeScript** — tipado completo

## 📹 Para agregar videos (Veo 3)
1. Generá el video con Google Veo 3
2. Subilo a Supabase Storage (bucket: `videos`)
3. Copiá la URL pública y pegala en el campo `video_url` de la propiedad

## 🤖 Para configurar el Agente de Voz (ElevenLabs)
1. Creá un agente en [elevenlabs.io](https://elevenlabs.io)
2. Copiá el Agent ID
3. Pegalo en `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` en `.env.local`
4. En `layout.tsx` agregá el script de ElevenLabs Convai

---
Desarrollado con ❤️ para Centro Jurídico NOA · Jujuy, Argentina
