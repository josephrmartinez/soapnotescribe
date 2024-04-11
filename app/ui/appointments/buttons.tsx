import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
  DocumentPlusIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
// import { deleteAppointment } from '@/app/lib/actions';

export function CreateAppointment() {
  return (
    <Link
      href="/dashboard/appointments/create"
      className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Appointment</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewSOAPNote({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/notes/${id}`}
      className="flex flex-row rounded-md border border-gray-200 bg-teal-600 p-2 font-semibold text-white transition-colors hover:bg-teal-500"
    >
      <div className="text-sm ">view SOAP note</div>
      <ArrowRightIcon className="h-5 md:ml-4 md:mr-1" />
    </Link>
  );
}

export function ProcessingSOAPNote({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/notes/${id}`}
      className="flex flex-row rounded-md border border-gray-200 p-2 text-teal-600 transition-colors hover:bg-gray-100"
    >
      <div className="text-sm font-semibold">processing</div>
      {/* <ArrowRightIcon className="h-5 md:ml-4 md:mr-1" /> */}
      <div className="loader ml-4 h-5"></div>
    </Link>
  );
}

// Update link to APPEND patient_name to url, handle case when page !== 1
export function PatientName({ patient_name }: { patient_name: string | null }) {
  return (
    <>
      {patient_name ? (
        <Link
          href={`/dashboard/notes?query=${patient_name}`}
          className={`rounded-md border border-gray-200 p-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100`}
        >
          {patient_name}
        </Link>
      ) : (
        <div></div>
      )}
    </>
  );
}

export function ReviewDraft({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/createnote/${id}`}
      className="flex flex-row rounded-md bg-red-500/90 p-2 shadow-md transition-all hover:bg-red-500 "
    >
      <div className="text-sm font-semibold text-white ">review draft</div>
      <ArrowRightIcon className="h-5 text-white md:ml-4 md:mr-1" />
    </Link>
  );
}

export function UpdateAppointment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/appointments/${id}/edit`}
      className="flex h-10 w-20 flex-row rounded-md border bg-teal-600 p-2 text-gray-50 transition-colors hover:bg-teal-500"
    >
      <PencilIcon className="w-5" />
      <div className="ml-1 tracking-wider">edit</div>
    </Link>
  );
}

export function AddDocsToAppointment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/appointments/${id}/edit`}
      className="flex h-10 w-44 flex-row rounded-md border bg-teal-600 p-2 text-gray-50 transition-colors hover:bg-teal-500"
    >
      <DocumentPlusIcon className="w-6" />
      <div className="ml-1 tracking-wider">add documents</div>
    </Link>
  );
}

export function ShareAppointment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/appointments/${id}/share`}
      className="flex h-10 w-24 flex-row rounded-md border bg-teal-600 p-2 text-gray-50 transition-colors hover:bg-teal-500"
    >
      <ShareIcon className="w-6" />
      <div className="ml-1 tracking-wider">share</div>
    </Link>
  );
}

export function DeleteAppointment({ id }: { id: string }) {
  // const deleteAppointmentWithId = deleteAppointment.bind(null, id); (<form action={deleteAppointmentWithId}>)
  return (
    <form>
      <button className="rounded-md border p-2 transition-colors hover:bg-red-500 hover:text-white">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
