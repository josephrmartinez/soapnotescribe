import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers, fetchCustomerById } from '@/app/lib/data';
import { notFound } from 'next/navigation'; 


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ]);

    const customer = await fetchCustomerById(invoice.customer_id);

    if (!invoice) {
      notFound();
    }


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'View Invoice',
            href: `/dashboard/invoices/${id}`,
            active: true,
          },
        ]}
      />
      <div>{customer.name}</div>
      <div>{invoice.amount}</div>
      <div>{invoice.id}</div>
      <div>{invoice.status}</div>
    </main>
  );
}