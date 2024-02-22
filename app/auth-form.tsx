'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'
import { useEffect } from 'react'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()

  let redirectUrl;

  if (process.env.NODE_ENV === 'production') {
      redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL;
  } else {
      redirectUrl = process.env.NEXT_PUBLIC_DEV_REDIRECT;
  }

  return (
    <div className='mx-auto'>
        <div className='mb-2 text-lg font-semibold text-gray-600'>Easy log in or sign up:</div>
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
          localization={{
            variables: {
             magic_link: {
              email_input_label: ''
             }
            }
          }}
          showLinks={false}
          providers={[]}
          redirectTo={redirectUrl}
        />
    </div>
    
  )
}