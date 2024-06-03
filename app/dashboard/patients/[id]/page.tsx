// import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/notes/breadcrumbs';
import {
  getSignedAudioUrl,
  getSignedPdfUrl,
  fetchPatientById,
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDaysIcon,
  BuildingOffice2Icon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';
import { Button } from '@/app/ui/button';
import { DeleteNoteFirstStep } from '@/app/ui/notes/buttons';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Patient Profile',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  // Create and implement fetchPatientById function
  const patient = await fetchPatientById(id);
  console.log('patient data from patients/[id]:', patient);

  const patientDOB = formatDateToLocal(patient.date_of_birth);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Patients', href: '/dashboard/patients' },
          {
            label: `${patient.first_name} ${patient.last_name}`,
            href: `/dashboard/patients/${id}`,
            active: true,
          },
        ]}
      />

      <div className="max-w-prose">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className={`text-2xl`}>Patient Profile</h1>

          <div className="grid grid-cols-2 gap-2">
            {/* UPLOAD TO DELETE PATIENT FIRST STEP */}
            <DeleteNoteFirstStep id={patient.id} />
            <Link
              href={`/dashboard/patients/${patient.id}/edit`}
              className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-2  text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 "
            >
              <PencilSquareIcon width={20} height={20} className="mr-2" />
              Edit
            </Link>
          </div>
        </div>

        <div className="mb-4 max-w-prose rounded-md bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="mb-4">
              <label
                htmlFor="patient"
                className="mb-2 block text-sm font-medium"
              >
                Patient Name
              </label>
              <div className="relative">
                <div id="patient" className="px-2 py-2 text-sm">
                  {patient.first_name} {patient.last_name}
                </div>
              </div>
            </div>
            {/* Patient Date of Birth */}
            <div className="mb-4">
              <label
                htmlFor="appointment_date"
                className="mb-2 block text-sm font-medium"
              >
                Patient Date of Birth
              </label>
              <div className="relative">
                <div id="patient_dob" className="px-2 py-2 text-sm">
                  {patientDOB}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <div id="phone" className="px-2 py-2 text-sm">
                {patient.phone}
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <div id="email" className="px-2 py-2 text-sm">
                  {patient.email}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Home Address
            </label>
            <div className="relative">
              <div id="address" className="px-2 py-2 text-sm">
                <div>{patient.address_street}</div>
                {patient.address_unit && <div>{patient.address_unit}</div>}
                <div>
                  {patient.city}, {patient.state} {patient.zipcode}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="mb-4">
              <label
                htmlFor="allergies"
                className="mb-2 block text-sm font-medium"
              >
                Allergies
              </label>
              <div className="relative">
                <div className="px-2 py-2 text-sm">{patient.allergies}</div>
              </div>
            </div>
            {/* Telemedicine Consent */}
            <div className="mb-4">
              <label
                htmlFor="consent"
                className="mb-2 block text-sm font-medium"
              >
                Telemedicine Consent
              </label>
              <div className="px-2 py-2 text-sm">
                Patient consents to treatment.
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="profile_notes"
              className="mb-2 block text-sm font-medium"
            >
              Profile Notes
            </label>
            <div className="relative">
              <div id="profile_notes" className="px-2 py-2 text-sm">
                {patient.profile_notes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
