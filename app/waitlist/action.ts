'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'


export async function waitlist(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    note: formData.get('note') as string,
  }

  const { error } =
    await supabase
      .from('waitlist')
      .insert(
        {
          email: data.email,
          note: data.note,
        }
      )

  if (error) {
    console.error(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}