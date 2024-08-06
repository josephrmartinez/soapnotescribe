// import Form from '@/app/ui/appointments/edit-form';
import Breadcrumbs from '@/app/ui/notes/breadcrumbs';
import { fetchPatientById, fetchPatientProfileById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  PencilSquareIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { calculateAge, formatDateToLocal } from '@/app/lib/utils';
import { DownloadPatientNotes, NewNote } from '@/app/ui/patients/buttons';
import { ViewSOAPNote, ReviewDraft } from '@/app/ui/notes/buttons';
import Search from '@/app/ui/search';

interface NoteMetadata {
  id: string;
  chief_complaint: string;
  appointment_date: string;
  appointment_type: string;
  appointment_specialty: string;
  status: string;
}

export const metadata: Metadata = {
  title: 'Patient Profile',
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const id = params.id;
  const patient = await fetchPatientById(id);
  const patientProfile = await fetchPatientProfileById(id);

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  //const specialtiesReceived = ...

  // console.log('patient profile data from patients/[id]:', patientProfile);

  const specialtiesReceived = Array.from(
    new Set(
      patientProfile.note.map(
        (note: NoteMetadata) => note.appointment_specialty,
      ),
    ),
  );

  const appointmentTypesReceived = Array.from(
    new Set(
      patientProfile.note.map((note: NoteMetadata) => note.appointment_type),
    ),
  );

  console.log('query', query);
  const filteredNotes = patientProfile.note.filter((note: NoteMetadata) => {
    const queryLower = query.toLowerCase();
    return (
      note.chief_complaint.toLowerCase().includes(queryLower) ||
      note.appointment_date.toLowerCase().includes(queryLower) ||
      note.appointment_type.toLowerCase().includes(queryLower) ||
      note.appointment_specialty.toLowerCase().includes(queryLower) ||
      note.status.toLowerCase().includes(queryLower)
    );
  });

  const patientNotes = filteredNotes.map(
    (note: NoteMetadata, index: number) => (
      <div key={index}>
        {/* desktop view */}
        <div
          className={`my-2 hidden w-full grid-cols-4 items-center gap-4 rounded-lg border bg-gray-50 p-4 text-sm md:grid`}
          key={note.id}
        >
          <div className="col-span-4 font-semibold">
            {note.appointment_date}
          </div>
          <div className="text-md col-span-2 font-semibold">
            {note.chief_complaint}
          </div>
          <div className="text-md whitespace-nowrap text-center">
            {note.appointment_type}
          </div>
          <div className="text-md whitespace-nowrap text-center">
            {note.appointment_specialty}
          </div>
          <div className="text-center font-semibold text-teal-700">
            {note.status === 'approved' && <ViewSOAPNote id={note.id} />}
            {note.status === 'draft' && <ReviewDraft id={note.id} />}
          </div>
        </div>
        {/* mobile view */}
        <div
          className={`my-2 grid w-full grid-cols-2 items-center gap-4 rounded-lg border p-4 md:hidden ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'}`}
          key={note.id}
        >
          <div className="font-semibold">{note.appointment_date}</div>
          <div className="text-md col-span-2 font-medium">
            {note.chief_complaint}
          </div>
          <div className="text-md">{note.appointment_type}</div>
          <div className="text-md">{note.appointment_specialty}</div>
          <div className="">
            <ViewSOAPNote id={note.id} />
          </div>
        </div>
      </div>
    ),
  );

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
        <div className="mb-4 flex w-full">
          {/* <h1 className="mb-4 text-2xl sm:mb-0">Patient Profile</h1> */}

          <div className="grid grid-cols-2 gap-4">
            <Link
              href={`/dashboard/patients/${patient.id}/edit`}
              className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-2  text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 "
            >
              <PencilSquareIcon width={20} height={20} className="mr-2" />
              Edit Profile
            </Link>
            <NewNote patient_id={patient.id} />
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
            {/* <div className="mb-4">
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
            </div> */}
            <div className="mb-4">
              <label
                htmlFor="appointment_types"
                className="mb-2 block text-sm font-medium"
              >
                Appointment Types
              </label>
              <div className="relative">
                <div id="appointment_types" className="px-2 py-2 text-sm">
                  {appointmentTypesReceived.join(', ')}
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
                <div id="appointment_specialties" className="px-2 py-2 text-sm">
                  {specialtiesReceived.join(', ')}
                </div>
              </div>
            </div>

            {patient.profile_notes && (
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
            )}
          </div>
        </div>

        <div>
          <div className="">
            <div className="mb-2 font-medium">
              <div className="mb-2">
                <label
                  htmlFor="patient_notes"
                  className="text-md font-semibold uppercase text-gray-700"
                >
                  Patient Notes
                </label>
              </div>

              <div className="flex flex-row items-center">
                <Search placeholder="Search Patient Notes..." />
                {patientNotes.length > 0 && (
                  <div className="ml-4 flex h-10 cursor-pointer flex-row items-center rounded-md border px-2 transition-all hover:bg-gray-50 hover:text-teal-700">
                    <ArrowDownTrayIcon height="22" />
                    <div className="ml-2  text-sm font-medium">
                      Download All Notes
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              <div className="sticky left-0 right-0 top-0 h-2 bg-gradient-to-b from-white to-transparent"></div>
              <div id="patient_notes" className="px-2">
                {patientNotes}
              </div>
              <div className="sticky bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-white to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

{
  /* <DownloadPatientNotes /> */
}
