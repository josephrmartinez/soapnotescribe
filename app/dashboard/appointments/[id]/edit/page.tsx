import EditAppointment from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById } from '@/app/lib/data';
import { notFound } from 'next/navigation'; 
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/app/database.types'



export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)

    if (!appointment) {
      notFound();
    }

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
            label: `${appointment.title} with ${appointment.provider}`,
            href: `/dashboard/appointments/${id}`
          },
          {
            label: 'Edit',
            href: `/dashboard/appointments/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditAppointment session={session} appointment={appointment}/>
    </main>
  );
}