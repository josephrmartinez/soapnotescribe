import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/app/database.types'
import CreateAppointment from './create-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create SOAP note",
}

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

 
  return (
    <main>
      <CreateAppointment session={session} />
    </main>
  );
}