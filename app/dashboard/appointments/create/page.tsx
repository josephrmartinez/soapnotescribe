import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/app/database.types'
import CreateAppointment from './create-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';


export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Appointments', href: '/dashboard/appointments' },
          {
            label: 'Add Appointment',
            href: '/dashboard/appointments/create',
            active: true,
          },
        ]}
      />
      <CreateAppointment session={session} />
    </main>
  );
}