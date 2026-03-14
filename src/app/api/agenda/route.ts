import { NextRequest, NextResponse } from 'next/server'

// In-memory store (reemplazar con Supabase cuando esté configurado)
const agendas: any[] = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, telefono, email, tipo, propiedad_id, fecha, horario, notas } = body

    if (!nombre || !telefono || !fecha || !horario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const agenda = {
      id: Date.now().toString(),
      nombre, telefono, email, tipo, propiedad_id, fecha, horario, notas,
      estado: 'confirmada',
      created_at: new Date().toISOString(),
    }
    agendas.push(agenda)

    return NextResponse.json({ success: true, agenda })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ agendas })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, estado } = body

  if (!id || !estado) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })

  const agenda = agendas.find(a => a.id === id)
  if (agenda) agenda.estado = estado

  return NextResponse.json({ success: true })
}
