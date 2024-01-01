import Form from '@/app/ui/appointments/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
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
      <Form customers={customers} />
    </main>
  );
}