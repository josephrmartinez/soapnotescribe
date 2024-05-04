'use client';

import Breadcrumbs from '@/app/ui/appointments/breadcrumbs';
import { fetchAppointmentById } from '@/app/lib/data';
import Link from 'next/link';
import { formatDateToLocal } from '@/app/lib/utils';
import { Metadata } from 'next';
import { Button } from '@/app/ui/button';
import { DeleteNoteConfirm } from '@/app/ui/appointments/buttons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Appointment } from '@/app/lib/definitions';

// export const metadata: Metadata = {
//   title: 'Delete Note',
// };

// UPDATE DELETE NOTE TO TAKE IN DATE AND PATIENT NAME PARAMS TO AVOID SECOND FETCH

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  // const appointment = await fetchAppointmentById(id);
  // const appointmentDate = formatDateToLocal(appointment.appointment_date);
  // const router = useRouter();
  // const handleCancel = () => {
  //   router.back();
  // };

  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointment = await fetchAppointmentById(id);
        setAppointment(appointment);
      } catch (error) {
        console.error('Failed to fetch appointment:', error);
        // Handle error appropriately
      }
    };

    fetchAppointment();
  }, [id]); // Fetch appointment when id changes

  const appointmentDate = appointment
    ? formatDateToLocal(appointment.appointment_date)
    : '';

  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  let label = '';

  if (appointmentDate && appointment?.patient_name) {
    label = `${appointmentDate} with ${appointment?.patient_name}`;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'SOAP Notes', href: '/dashboard/notes' },
          {
            label: label,
            href: `/dashboard/notes/${id}`,
            active: true,
          },
        ]}
      />

      <div className="max-w-prose">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className={` text-2xl`}>Delete Note</h1>
        </div>

        <div className="mb-4 flex max-w-prose flex-col items-center rounded-md bg-gray-50 p-4">
          <div>Are you sure you want to delete this SOAP note?</div>
          <div className="my-12 grid grid-cols-2 gap-4">
            <button
              onClick={handleCancel}
              className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 shadow-md transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <DeleteNoteConfirm id={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
