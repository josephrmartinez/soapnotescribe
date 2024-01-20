import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  req.headers.set('Access-Control-Allow-Origin', '*');
  req.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  req.headers.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  console.log("running middleware")

  const {
    data: { user },
  } = await supabase.auth.getUser()


  // if user is signed in and the current path is / redirect the user to /account
  if (user && req.nextUrl.pathname === '/') {
    console.log("user signed in. routing to app")
    return NextResponse.redirect(new URL('/dashboard/appointments', req.url))
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== '/') {
    console.log("user not signed in. access not allowed")
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/dashboard/appointments'],
}