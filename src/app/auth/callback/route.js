import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to dashboard after successful email verification
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect to login page if there's an error
  return NextResponse.redirect(new URL('/login', request.url))
}
