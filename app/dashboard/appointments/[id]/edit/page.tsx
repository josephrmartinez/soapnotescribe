import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById } from '@/app/lib/data';
import { notFound } from 'next/navigation'; 


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
          { label: 'Invoices', href: '/dashboard/appointments' },
          {
            label: 'Edit Appointment',
            href: `/dashboard/appointments/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form appointment={appointment} />
    </main>
  );
}