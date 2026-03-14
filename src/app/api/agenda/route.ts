import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, telefono, email, tipo, propiedad_id, fecha, horario, notas } = body

    if (!nombre || !telefono || !fecha || !horario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const { data, error } = await supabase.from('agenda').insert([{
      nombre, telefono, email, tipo, propiedad_id, fecha, horario, notas, estado: 'confirmada'
    }]).select().single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Error al guardar la cita' }, { status: 500 })
    }

    return NextResponse.json({ success: true, agenda: data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('agenda')
    .select('*, propiedades(titulo)')
    .order('fecha', { ascending: true })
    .order('horario', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ agendas: data })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, estado } = body

  if (!id || !estado) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })

  const { error } = await supabase.from('agenda').update({ estado }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
