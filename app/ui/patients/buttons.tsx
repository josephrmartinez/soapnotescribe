import {
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
  DocumentPlusIcon,
  ShareIcon,
  UserCircleIcon,
  ArchiveBoxIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function AddPatientButton() {
  return (
    <Link
      href={'/dashboard/patients/add'}
      className={
        'flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600'
      }
    >
      <PlusIcon width={22} className="mr-2" />
      Add New Patient
    </Link>
  );
}

export function ViewNotes({ patient_name }: { patient_name: string | null }) {
  return (
    <Link
      href={`./notes?query=${patient_name}`}
      className={`flex items-center whitespace-nowrap rounded-md  border-gray-200 p-2 text-sm font-medium text-teal-700 transition-colors hover:bg-gray-100`}
    >
      <ArchiveBoxIcon width={22} className="mr-2" />
      <div>View Notes</div>
    </Link>
  );
}

export function NewNote({ patient_id }: { patient_id: string }) {
  return (
    <Link
      href={`/dashboard/newnote?patient=${patient_id}`}
      className={`flex items-center whitespace-nowrap rounded-md  border-gray-200 p-2 text-sm font-medium text-teal-700 transition-colors hover:bg-gray-100`}
    >
      <PencilSquareIcon width={22} className="mr-2" />
      New Note
    </Link>
  );
}

export function PatientNameLink({
  patient_id,
  first_name,
  last_name,
}: {
  patient_id: string;
  first_name: string;
  last_name: string;
}) {
  return (
    <Link
      href={`/dashboard/patients/${patient_id}`}
      className={`rounded-md border border-gray-200 p-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100`}
    >
      {last_name}, {first_name}
    </Link>
  );
}

export function ViewProfile({ patient_id }: { patient_id: string }) {
  return (
    <Link
      href={`/dashboard/patients/${patient_id}`}
      className={`nowrap flex w-24 rounded-md p-2 text-sm font-medium text-teal-700 underline  underline-offset-8 transition-colors hover:bg-gray-100`}
    >
      View Profile
    </Link>
  );
}

export function EditProfile({ patient_id }: { patient_id: string }) {
  return (
    <div className="flex items-center">
      <Link
        href={`/dashboard/patients/${patient_id}/edit`}
        className={`nowrap flex rounded-md p-2 text-center text-sm font-medium text-teal-700 underline  underline-offset-8 transition-colors hover:bg-gray-100`}
      >
        Edit Profile
      </Link>
    </div>
  );
}
export function EditPatientProfile({ patient_id }: { patient_id: string }) {
  return (
    <Link
      href={`/dashboard/patients/${patient_id}/edit`}
      className="flex h-10 items-center rounded-lg border px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-teal-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600"
    >
      <UserIcon width={22} className="mr-2" />
      <div>Edit Patient Profile</div>
    </Link>
  );
}

export function CreateNewNote({ patient_id }: { patient_id: string }) {
  return (
    <Link
      href={`/dashboard/newnote?patient=${patient_id}`}
      className="flex h-10 items-center rounded-lg border bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600"
    >
      <PencilSquareIcon width={22} className="mr-2" />
      <div>Create New Note</div>
    </Link>
  );
}

export function DownloadPatientNotes() {
  return (
    <Link
      href={'/dashboard/patients/add'}
      className={
        ' inline-flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-600'
      }
    >
      <DocumentPlusIcon width={22} className="mr-2" />
      Download Patient's Notes
    </Link>
  );
}
