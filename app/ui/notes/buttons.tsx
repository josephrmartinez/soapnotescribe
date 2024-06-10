'use client';

import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
  DocumentPlusIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteNote } from '@/app/lib/actions';

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
      <div className="mr-2 text-sm">view note</div>
      <ArrowRightIcon className="h-5 md:ml-4 md:mr-1" />
    </Link>
  );
}

export function ProcessingSOAPNote({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/deletenote/${id}`}
      className="flex flex-row rounded-md border border-gray-200 p-2 text-teal-600 transition-colors hover:bg-gray-100"
    >
      <div className="text-sm font-semibold">processing</div>
      {/* <ArrowRightIcon className="h-5 md:ml-4 md:mr-1" /> */}
      <div className="loader ml-4 h-5"></div>
    </Link>
  );
}

// Update tohandle case when page !== 1
export function PatientName({
  first_name,
  last_name,
}: {
  first_name: string | null;
  last_name: string | null;
}) {
  return (
    <>
      {last_name ? (
        <Link
          href={`?query=${last_name}, ${first_name}`}
          className={`rounded-md border border-gray-200 p-2 text-center text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100`}
        >
          {`${last_name}, ${first_name}`}
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
      href={`/dashboard/notes/${id}/edit`}
      className="flex flex-row rounded-md bg-red-600 p-2 shadow-md transition-all hover:bg-red-500 "
    >
      <div className="mr-2 text-sm font-semibold text-white">review draft</div>
      <ArrowRightIcon className="h-5 text-white md:ml-4 md:mr-1" />
    </Link>
  );
}

// export function ReviewDraft({ id }: { id: string }) {
//   return (
//     <Link
//       href={`/dashboard/newnote/${id}`}
//       className="flex flex-row rounded-md bg-red-600 p-2 shadow-md transition-all hover:bg-red-500 "
//     >
//       <div className="text-sm font-semibold text-white ">review draft</div>
//       <ArrowRightIcon className="h-5 text-white md:ml-4 md:mr-1" />
//     </Link>
//   );
// }

// export function UpdateAppointment({ id }: { id: string }) {
//   return (
//     <Link
//       href={`/dashboard/appointments/${id}/edit`}
//       className="flex h-10 w-20 flex-row rounded-md border bg-teal-600 p-2 text-gray-50 transition-colors hover:bg-teal-500"
//     >
//       <PencilIcon className="w-5" />
//       <div className="ml-1 tracking-wider">edit</div>
//     </Link>
//   );
// }

// export function AddDocsToAppointment({ id }: { id: string }) {
//   return (
//     <Link
//       href={`/dashboard/appointments/${id}/edit`}
//       className="flex h-10 w-44 flex-row rounded-md border bg-teal-600 p-2 text-gray-50 transition-colors hover:bg-teal-500"
//     >
//       <DocumentPlusIcon className="w-6" />
//       <div className="ml-1 tracking-wider">add documents</div>
//     </Link>
//   );
// }

// export function ShareAppointment({ id }: { id: string }) {
//   return (
//     <Link
//       href={`/dashboard/appointments/${id}/share`}
//       className="flex h-10 w-24 flex-row rounded-md border bg-teal-600 p-2 text-gray-50 transition-colors hover:bg-teal-500"
//     >
//       <ShareIcon className="w-6" />
//       <div className="ml-1 tracking-wider">share</div>
//     </Link>
//   );
// }

export function DeleteNoteFirstStep({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/deletenote/${id}`}
      className="flex h-10  items-center justify-center rounded-lg bg-gray-100 px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-500/90 hover:text-white"
    >
      <TrashIcon width={20} height={20} className="mr-2" />
      Delete
    </Link>
  );
}

export function DeleteNoteConfirm({ id }: { id: string }) {
  const deleteNoteWithId = deleteNote.bind(null, id);

  // call handleClick
  // handleClick()
  // isLoading = active
  // ... server action
  // handle error

  return (
    <form action={deleteNoteWithId}>
      <button className="flex h-10 flex-row items-center rounded-md bg-red-600 p-2 text-sm font-semibold text-white transition-all hover:bg-red-500">
        <TrashIcon width={20} height={20} className="mr-2" />
        Delete
      </button>
    </form>
  );
}
