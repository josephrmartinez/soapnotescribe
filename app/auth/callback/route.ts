import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log("calling callback route")
  
  
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  // async function getCookieData() {
  //   const cookieData = cookies().getAll()
  //   return new Promise((resolve) =>
  //     setTimeout(() => {
  //       resolve(cookieData)
  //     }, 1000)
  //   )
  // }

  

  if (code) {
    // const cookieStore = cookies()
    // const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Updated to this approach due to dynamic server usage error. https://github.com/vercel/next.js/issues/56630
    cookies().getAll()

    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/', req.url))
}