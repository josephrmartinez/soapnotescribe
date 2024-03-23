'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ClientComponent from './clientComponent'

export default async function PrivatePage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    console.error(error)
    redirect('/error')
  }

  return (
  <div>
  <p>Hello {data.user.email} this is your userid from the server: {data.user.id}</p>
  <ClientComponent/>  

  </div>
  )
}