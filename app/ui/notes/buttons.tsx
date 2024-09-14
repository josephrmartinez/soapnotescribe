'use client';

import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
  UserIcon,
  DocumentPlusIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteNote } from '@/app/lib/data';
import { DeleteButton } from '../buttons/Buttons';

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
      className="flex w-32 flex-row justify-center  rounded-md border border-gray-200 bg-teal-600 p-2 font-semibold  text-white transition-colors hover:bg-teal-500"
    >
      <div className="text-sm">View Note</div>
    </Link>
  );
}

export function ViewSOAPNoteTeal({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/notes/${id}`}
      className="flex flex-row rounded-md border border-gray-200 bg-teal-600 p-2 font-semibold text-white transition-colors hover:bg-teal-500"
    >
      <div className="mr-2 text-sm">View Note</div>
      <ArrowRightIcon className="h-5 md:ml-4 md:mr-1" />
    </Link>
  );
}

export function ProcessingSOAPNote({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/notes/${id}/processing`}
      className="flex flex-row rounded-md border border-gray-200 bg-gray-50 p-2 text-teal-700 transition-colors hover:bg-gray-100"
    >
      <div className="text-sm font-semibold">Processing</div>
      {/* <ArrowRightIcon className="h-5 md:ml-4 md:mr-1" /> */}
      <div className="loader ml-3 h-5"></div>
    </Link>
  );
}

// Update tohandle case when page !== 1
export function PatientName({
  first_name,
  last_name,
  patient_id,
}: {
  first_name: string | null;
  last_name: string | null;
  patient_id: string | null;
}) {
  return (
    <div>
      {last_name ? (
        <Link
          href={`/dashboard/patients/${patient_id}`}
          className="flex w-32 flex-row justify-center rounded-md border  p-2 text-center transition-all "
        >
          <div className="whitespace-nowrap text-sm font-semibold text-gray-800">{`${last_name}, ${first_name}`}</div>
        </Link>
      ) : (
        // <Link
        //   href={`/dashboard/patients/${patient_id}`}
        //   className={`rounded-md border border-gray-200  text-center text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100`}
        // >
        //   {`${last_name}, ${first_name}`}
        // </Link>
        <div></div>
      )}
    </div>
  );
}

export function ReviewDraft({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/notes/${id}/edit`}
      className="flex w-32 flex-row justify-center rounded-md border border-red-600 bg-red-600 p-2 text-center shadow-md transition-all hover:border-red-500 hover:bg-red-500 "
    >
      <div className="text-sm font-semibold text-white">Review Draft</div>
    </Link>
  );
}

export function DeleteNoteFirstStep({ id }: { id: string }) {
  return <DeleteButton text="Delete" href={`/dashboard/notes/${id}/delete`} />;
}

export function DeleteNoteConfirm({ id }: { id: string }) {
  return (
    <form action={deleteNote}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton text="Delete" />
    </form>
  );
}
