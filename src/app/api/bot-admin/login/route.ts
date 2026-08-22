import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// POST /api/bot-admin/login
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    const VALID_EMAIL = 'botadmin@disnakertrans-research.id'
    const VALID_PASS = 'BotAdmin123!'

    if ((email === VALID_EMAIL || email === 'bot@admin.com') && (password === VALID_PASS || password === 'bot123')) {
      const cookieStore = await cookies()
      cookieStore.set('bot_admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return NextResponse.json({ success: true, user: { email: VALID_EMAIL, name: 'Bot Administrator' } })
    }

    return NextResponse.json({ error: 'Email atau password Bot Admin tidak sesuai.' }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal login Bot Admin' }, { status: 500 })
  }
}

// GET /api/bot-admin/session — check session
export async function GET() {
  const cookieStore = await cookies()
  const hasSession = cookieStore.get('bot_admin_session')?.value === 'true'

  if (hasSession) {
    return NextResponse.json({ authenticated: true, user: { email: 'botadmin@disnakertrans-research.id', name: 'Bot Administrator' } })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}

// DELETE /api/bot-admin/logout
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('bot_admin_session')
  return NextResponse.json({ success: true })
}
