import { PencilIcon, PlusIcon, TrashIcon, ArrowRightIcon, DocumentPlusIcon, ShareIcon } from '@heroicons/react/24/outline';
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
      href={`/dashboard/appointments/${id}`}
      className="flex flex-row rounded-md text-teal-600 border border-gray-200 p-2 transition-colors hover:bg-gray-100"
    >
      <div className='text-sm '>view SOAP note</div>
      <ArrowRightIcon className="h-5 md:ml-4 md:mr-1" />
    </Link>
  );
}

export function ReviewDraft({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/create/${id}`}
      className="flex flex-row rounded-md bg-red-500 shadow-md hover:bg-red-400 p-2 transition-all "
    >
      <div className='text-sm font-semibold uppercase text-white '>review draft</div>
      <ArrowRightIcon className="h-5 md:ml-4 md:mr-1 text-white" />
    </Link>
  );
}

export function UpdateAppointment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/appointments/${id}/edit`}
      className="flex flex-row w-20 h-10 rounded-md border p-2 bg-teal-600 text-gray-50 transition-colors hover:bg-teal-500"
    >
      
      <PencilIcon className="w-5" />
      <div className='tracking-wider ml-1'>edit</div>
    </Link>
  );
}

export function AddDocsToAppointment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/appointments/${id}/edit`}
      className="flex flex-row w-44 h-10 rounded-md border p-2 bg-teal-600 text-gray-50 transition-colors hover:bg-teal-500"
    >
      
      <DocumentPlusIcon className="w-6" />
      <div className='tracking-wider ml-1'>add documents</div>
    </Link>
  );
}

export function ShareAppointment({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/appointments/${id}/share`}
      className="flex flex-row w-24 h-10 rounded-md border p-2 bg-teal-600 text-gray-50 transition-colors hover:bg-teal-500"
    >
      
      <ShareIcon className="w-6" />
      <div className='tracking-wider ml-1'>share</div>
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
