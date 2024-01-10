'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()

  return (
    <div className='mt-20 mx-auto w-10/12'>
        <Auth
      supabaseClient={supabase}
      view="sign_in"
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
      showLinks={true}
      providers={[]}
      redirectTo="http://localhost:3000/auth/callback"
    />
    </div>
    
  )
}