import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ──────────────────────────────────────────────────────────────────────────────
// WhatsApp AI Agent — Centro Jurídico NOA
//
// Webhook receptor de mensajes Twilio WhatsApp.
// Usa GPT-4o (OpenAI) para responder consultas inmobiliarias.
//
// Env vars required:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
//   OPENAI_API_KEY
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// ──────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Sos el asistente virtual de Centro Jurídico NOA, una inmobiliaria premium de Jujuy, Argentina.
Tu nombre es "NOA" y respondés únicamente en castellano rioplatense formal pero cálido.

**Tu rol:**
- Ayudás a los clientes a encontrar propiedades (casas, departamentos, terrenos, countries, oficinas).
- Respondés preguntas sobre el proceso de compra, venta y alquiler con respaldo jurídico.
- Agendás visitas o consultas.
- Captás datos del lead (nombre, teléfono, presupuesto, zona de interés).

**Flujo conversacional:**
1. Saludo + consulta qué busca el cliente.
2. Identificar tipo de propiedad, zona, presupuesto y cantidad de ambientes.
3. Buscar en la base de datos y presentar hasta 3 opciones relevantes.
4. Ofrecer agendar visita o videollamada.
5. Si no podés ayudar → "Te comunico con un asesor humano. ¿Podés dejarnos tu nombre y teléfono?"

**Reglas:**
- Máximo 3 propiedades por respuesta.
- Nunca inventes datos de propiedades. Solo usá la info en [PROPIEDADES].
- Si el cliente insulta o es inapropiado, respondé con cortesía y ofrecé comunicarlo con un humano.
- Las visitas son de lunes a sábado de 9:00 a 18:00 hs.
- Siempre mencioná que "Todas las operaciones tienen respaldo jurídico de nuestro estudio."

**Formato de respuestas:**
- Breves y claras (máximo 3 párrafos cortos o una lista de máximo 5 puntos).
- No uses Markdown complejo — solo texto plano con asteriscos para negritas si es necesario.
`

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// In-memory session store (reemplazar con Redis en producción)
const sessions: Record<string, { messages: ChatMessage[]; leadGuardado: boolean }> = {}

// ── Twilio signature validation helper ──────────────────────────────────────
async function validateTwilioSignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!accountSid || !authToken) return false

  const twilioSignature = req.headers.get('x-twilio-signature') || ''
  const url = req.url

  // Build sorted param string
  const params = new URLSearchParams(rawBody)
  const sortedKeys = Array.from(params.keys()).sort()
  let paramStr = url
  for (const key of sortedKeys) {
    paramStr += key + (params.get(key) || '')
  }

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(authToken), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(paramStr))
  const expected = `${btoa(String.fromCharCode(...new Uint8Array(sig)))}`
  return expected === twilioSignature
}

// ── Search properties from Supabase ─────────────────────────────────────────
async function buscarPropiedades(query: {
  tipo?: string
  precioMax?: number
  habitaciones?: number
  ciudad?: string
}): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let q = supabase.from('propiedades').select('id,titulo,precio,moneda,ciudad,habitaciones,m2_totales,tipo,descripcion_corta').eq('estado', 'disponible')
  if (query.tipo) q = q.eq('tipo', query.tipo)
  if (query.ciudad) q = q.ilike('ciudad', `%${query.ciudad}%`)
  if (query.habitaciones) q = q.gte('habitaciones', query.habitaciones)
  if (query.precioMax) q = q.lte('precio', query.precioMax)
  q = q.order('destacada', { ascending: false }).limit(3)

  const { data, error } = await q
  if (error || !data?.length) return 'No encontré propiedades que coincidan con esos criterios.'

  return data.map((p: { id: string; titulo: string; precio: number; moneda: string; ciudad: string; habitaciones?: number; m2_totales?: number; tipo?: string; descripcion_corta?: string }) =>
    `• *${p.titulo}* — ${p.moneda} ${p.precio.toLocaleString('es-AR')} | ${p.ciudad} | ${p.habitaciones ? p.habitaciones + ' amb.' : ''} ${p.m2_totales ? p.m2_totales + 'm²' : ''}\n  ${p.descripcion_corta || ''}\n  Ver: https://cjnoa.com/propiedades/${p.id}`
  ).join('\n\n')
}

// ── Save lead from WhatsApp ──────────────────────────────────────────────────
async function guardarLeadWA(nombre: string, telefono: string, notas?: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  await supabase.from('leads').upsert([{
    nombre, telefono, origen: 'whatsapp', estado: 'nuevo', notas
  }], { onConflict: 'telefono' })
}

// ── Send WhatsApp message via Twilio ─────────────────────────────────────────
async function sendWhatsApp(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
  if (!sid || !token) throw new Error('Twilio credentials not configured')

  const params = new URLSearchParams({
    From: from,
    To: to,
    Body: body,
  })

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Twilio error: ${err}`)
  }
}

// ── Call OpenAI GPT-4o ────────────────────────────────────────────────────────
async function chatWithGPT(messages: ChatMessage[], propiedadesTxt?: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return 'El servicio de IA no está configurado. Te comunico con un asesor. ¿Tu nombre y teléfono?'

  const systemMessages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(propiedadesTxt ? [{ role: 'system' as const, content: `[PROPIEDADES DISPONIBLES]\n${propiedadesTxt}` }] : []),
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [...systemMessages, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`)
  const json = await res.json()
  return json.choices?.[0]?.message?.content?.trim() || 'No pude procesar tu consulta. ¿Podés repetirla?'
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let rawBody = ''
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Bad request body' }, { status: 400 })
  }

  // Validate Twilio signature in production
  if (process.env.NODE_ENV === 'production') {
    const valid = await validateTwilioSignature(req, rawBody)
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }

  const params = new URLSearchParams(rawBody)
  const from = params.get('From') || ''        // e.g. "whatsapp:+5493884123456"
  const body = (params.get('Body') || '').trim()

  if (!from || !body) {
    return NextResponse.json({ error: 'Missing From or Body' }, { status: 400 })
  }

  // Sanitize the phone number for storage
  const telefono = from.replace('whatsapp:', '').trim()

  // Get or init session
  if (!sessions[from]) {
    sessions[from] = { messages: [], leadGuardado: false }
  }
  const session = sessions[from]

  // Add user message
  session.messages.push({ role: 'user', content: body })

  // Keep context window manageable (last 20 messages)
  if (session.messages.length > 20) {
    session.messages = session.messages.slice(-20)
  }

  // Detect keywords to search properties
  let propiedadesCtx = ''
  const lowerBody = body.toLowerCase()
  const buscaPropiedad = /(busco|quiero|necesito|tengo interés|propiedades|casas?|deptos?|departamentos?|terrenos?|countries|offices?|oficinas?)/.test(lowerBody)
  if (buscaPropiedad) {
    const tipo = /casa/.test(lowerBody) ? 'casa'
      : /depto|departamento/.test(lowerBody) ? 'departamento'
      : /terreno/.test(lowerBody) ? 'terreno'
      : /country/.test(lowerBody) ? 'country'
      : /oficina/.test(lowerBody) ? 'oficina'
      : undefined
    const precioMatch = lowerBody.match(/(\d[\d.,]*)\s*(mil|k|usd|dólares?|pesos?)?/)
    const precioMax = precioMatch ? parseFloat(precioMatch[1].replace(/[.,]/g, '')) * (precioMatch[2]?.includes('mil') || precioMatch[2] === 'k' ? 1000 : 1) : undefined
    propiedadesCtx = await buscarPropiedades({ tipo, precioMax })
  }

  // Generate AI response
  let reply: string
  try {
    reply = await chatWithGPT(session.messages, propiedadesCtx || undefined)
  } catch {
    reply = 'Tuve un problema técnico. Comunicate con nosotros al +54 388 4XXXXXXX o enviá un mensaje a nuestro equipo.'
  }

  // Add assistant reply to session
  session.messages.push({ role: 'assistant', content: reply })

  // Auto-save lead after first interaction if phone available
  if (!session.leadGuardado && telefono) {
    session.leadGuardado = true
    guardarLeadWA('Cliente WhatsApp', telefono, `Primer mensaje: ${body}`).catch(() => {})
  }

  // Send reply via Twilio
  try {
    await sendWhatsApp(from, reply)
  } catch {
    // If Twilio send fails, return TwiML response as fallback
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`,
      { status: 200, headers: { 'Content-Type': 'text/xml' } }
    )
  }

  return NextResponse.json({ success: true, reply })
}

// ── GET: health check ────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    agent: 'CJ NOA WhatsApp AI Agent',
    model: 'gpt-4o',
    activeSessions: Object.keys(sessions).length,
  })
}
