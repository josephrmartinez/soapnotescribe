import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById } from '@/app/lib/data';
import { notFound } from 'next/navigation'; 
import ShareAppointmentForm from '@/app/ui/appointments/share-form';


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)

    if (!appointment) {
      notFound();
    }


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
            label: 'Share',
            href: `/dashboard/appointments/${id}/share`,
            active: true,
          },
        ]}
      />
      <ShareAppointmentForm />
    </main>
  );
}