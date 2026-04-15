import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

/**
 * Simple in-memory rate limiter
 * In production, use Redis or similar for distributed rate limiting
 */
const rateLimit = new Map()

function getRateLimitKey(ip) {
  return `${ip}:${Math.floor(Date.now() / 60000)}` // 1-minute window
}

function checkRateLimit(ip, limit = 100) {
  const key = getRateLimitKey(ip)
  const count = rateLimit.get(key) || 0
  
  if (count >= limit) {
    return false
  }
  
  rateLimit.set(key, count + 1)
  
  // Clean up old entries (every 2 minutes)
  if (count === 0) {
    setTimeout(() => {
      rateLimit.delete(key)
    }, 120000)
  }
  
  return true
}

/**
 * Middleware for handling session refreshing and protected route access.
 * Required for @supabase/ssr to stay in sync with Server Components.
 */
export async function middleware(request) {
  // Check request size limit (10MB)
  const contentLength = request.headers.get('content-length')
  const MAX_REQUEST_SIZE = 10 * 1024 * 1024 // 10MB
  
  if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
    return new NextResponse(
      JSON.stringify({ error: 'Request too large' }),
      { status: 413, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Rate limiting (100 requests per minute per IP)
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  if (!checkRateLimit(ip, 100)) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh the session if needed
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Redirect if not logged in and accessing a protected route
  const isProtectedRoute = path.startsWith('/dashboard') || 
                          path.startsWith('/symptom-checker') || 
                          path.startsWith('/find-facility') || 
                          path.startsWith('/health-tips') || 
                          path.startsWith('/reminders') || 
                          path.startsWith('/profile') || 
                          path.startsWith('/onboarding')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectedFrom", path)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if logged in and accessing login/register
  // Note: we redirect to /onboarding here to avoid a double-redirect via the dashboard
  if (user && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
