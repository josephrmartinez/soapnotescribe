'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'
import { useEffect } from 'react'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()


  return (
    <div className='mt-20 mx-auto w-10/12'>
        <div className='mb-8 text-lg font-semibold'>Easy log in or sign up:</div>
        <Auth
          supabaseClient={supabase}
          view="magic_link"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0F766E',
                  brandAccent: '#0D9488'
                }
              }
            }
          }}
          showLinks={false}
          providers={[]}
          // redirectTo="http://advocateai.vercel.app/auth/callback"
          redirectTo="http://localhost:3000/auth/callback"
        />
    </div>
    
  )
}

// redirectTo="http://localhost:3000/auth/callback"