import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById } from '@/app/lib/data';
import Link from 'next/link';
import { formatDateToLocal } from '@/app/lib/utils';
import { Metadata } from 'next';
import { Button } from '@/app/ui/button';
import { deleteAppointment } from '@/app/lib/data';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const metadata: Metadata = {
  title: 'Delete Note',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const appointment = await fetchAppointmentById(id);

  const appointmentDate = formatDateToLocal(appointment.appointment_date);

  const handleDelete = async (id: string) => {
    'use server';
    deleteAppointment(id);
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'SOAP Notes', href: '/dashboard/notes' },
          {
            label: `${appointmentDate} with ${appointment.patient_name}`,
            href: `/dashboard/notes/${id}`,
            active: true,
          },
        ]}
      />

      <div className="max-w-prose">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className={` text-2xl`}>Delete Note</h1>

          {/* <div className="grid grid-cols-3 gap-4">
            <Link
              href={`/dashboard/notes/${appointment.id}/delete`}
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Delete
            </Link>
            <Link
              href={`/dashboard/createnote/${appointment.id}`}
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Edit
            </Link>
            <Button>copy</Button>

            <Button>pdf</Button>
          </div> */}
        </div>

        <div className="mb-4 flex max-w-prose flex-col items-center rounded-md bg-gray-50 p-4">
          <div>Are you sure you want to delete this SOAP note?</div>
          <div className="my-12 grid grid-cols-2 gap-4">
            <Link
              href={`/dashboard/notes/${id}`}
              className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 shadow-md transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <div className="flex cursor-pointer flex-row items-center rounded-md bg-red-500/90 p-2 px-4 shadow-md transition-all hover:bg-red-500 ">
              <div
                className="text-sm font-semibold text-white"
                onClick={handleDelete}
              >
                Delete Note
              </div>
              {/* <ArrowRightIcon className="h-5 text-white md:ml-4 md:mr-1" /> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
