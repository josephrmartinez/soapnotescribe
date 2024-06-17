// import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/notes/breadcrumbs';
import { fetchPatientById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { calculateAge, formatDateToLocal } from '@/app/lib/utils';
import { DownloadPatientNotes } from '@/app/ui/patients/buttons';

export const metadata: Metadata = {
  title: 'Patient Profile',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const patient = await fetchPatientById(id);
  console.log('patient data from patients/[id]:', patient);

  // const patientDOB = formatDateToLocal(patient.date_of_birth);
  const dateToday = new Date();
  const patientAge = calculateAge(patient.date_of_birth, dateToday.toString());

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Patients', href: '/dashboard/patients' },
          {
            label: `${patient.first_name} ${patient.middle_name && patient.middle_name} ${patient.last_name}`,
            href: `/dashboard/patients/${id}`,
            active: true,
          },
        ]}
      />

      <div className="max-w-prose">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className={`text-2xl`}>Patient Profile</h1>

          <div className="">
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
            <div className="">
              <label
                htmlFor="patient"
                className="mb-2 block text-sm font-medium"
              >
                Patient
              </label>
              <div className="relative">
                <div id="patient" className="px-2 py-2 text-sm">
                  {patient.first_name} {patient.middle_name} {patient.last_name}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <div id="phone" className="px-2 py-2 text-sm">
                {patient.phone}
              </div>
            </div>

            {/* Patient Date of Birth */}
            <div className="">
              <label
                htmlFor="appointment_date"
                className="mb-2 block text-sm font-medium"
              >
                Patient Date of Birth
              </label>
              <div className="relative">
                <div id="patient_dob" className="px-2 py-2 text-sm">
                  {patient.date_of_birth}
                </div>
              </div>
            </div>

            <div className="">
              <label
                htmlFor="patient_age"
                className="mb-2 block text-sm font-medium"
              >
                Patient Age
              </label>
              <div className="ml-2 text-sm">
                <div>{patientAge} years old</div>
              </div>
            </div>

            {/* Email Address */}
            <div className="">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <div id="email" className="px-2 py-2 text-sm">
                  {patient.email}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium"
              >
                Home Address
              </label>
              <div className="relative">
                <div id="address" className="px-2 py-2 text-sm">
                  <div>{patient.address_street}</div>
                  {patient.address_unit && <div>{patient.address_unit}</div>}
                  <div>
                    {patient.city}
                    {patient.city && ','} {patient.state} {patient.zipcode}
                  </div>
                  <div>{patient.country}</div>
                </div>
              </div>
            </div>

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

            <div className="mb-4">
              <label
                htmlFor="referral_source"
                className="mb-2 block text-sm font-medium"
              >
                Referral Source
              </label>
              <div className="relative">
                <div id="referral_source" className="px-2 py-2 text-sm">
                  {patient.referral_source}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="clinical_status"
                className="mb-2 block text-sm font-medium"
              >
                Clinical Status
              </label>
              <div className="relative">
                <div id="clinical_status" className="px-2 py-2 text-sm">
                  Due for Annual
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="appointment_types"
                className="mb-2 block text-sm font-medium"
              >
                Appointment Types
              </label>
              <div className="relative">
                <div id="appointment_types" className="px-2 py-2 text-sm">
                  Telemedicine and / or In Person
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="appointment_specialties"
                className="mb-2 block text-sm font-medium"
              >
                Appointment Specialties Received
              </label>
              <div className="relative">
                <div id="appointment_types" className="px-2 py-2 text-sm">
                  addiction medicine, behavioral health, primary care, urgent
                  care, wound care, IV Treatment, metabolic, HRT, aesthetics
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="patient_notes"
                className="mb-2 block text-sm font-medium"
              >
                Patient Notes
              </label>
              <div className="relative">
                <div id="appointment_types" className="px-2 py-2 text-sm">
                  Date - Appointment Type - Chief Complaint
                </div>
              </div>
            </div>
            <DownloadPatientNotes />
          </div>
        </div>
      </div>
    </main>
  );
}
