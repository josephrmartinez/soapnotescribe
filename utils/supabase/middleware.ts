import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log("running updateSession supabase middleware")

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )  

  return response
}

// try {
//   let user = await supabase.auth.getUser()

//   if (user && request.nextUrl.pathname === '/') {
//           console.log("user signed in. routing to app")
//           return NextResponse.redirect(new URL('/dashboard', request.url))
//       }
      
//       // if user is not signed in and the current path is not / redirect the user to /
//       if (!user && request.nextUrl.pathname !== '/') {
//           console.log("user not signed in. access not allowed")
//           return NextResponse.redirect(new URL('/', request.url))
//       }
//   } catch (error) {
//       console.error("Error checking user auth status:", error)
//       return NextResponse.redirect(new URL('/', request.url))
//   }