'use client';

import {
  ViewSOAPNote,
  ReviewDraft,
  ProcessingSOAPNote,
  PatientName,
} from '@/app/ui/notes/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Note, NoteWithPatient } from '@/app/lib/definitions';

export default function NotesTable({ notes }: { notes: NoteWithPatient[] }) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel('postgresChangesChannel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'note',
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {notes?.map((note) => (
              <div
                key={note.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{formatDateToLocal(note.appointment_date)}</p>
                    </div>
                    <p className="text-sm text-gray-500">{`${note.patient.last_name}, ${note.patient.first_name}`}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {note.chief_complaint}
                    </p>
                    <p>{note.status}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ViewSOAPNote id={note.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Patient
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Chief Complaint
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  View Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {notes?.map((note) => (
                <tr
                  key={note.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3 font-medium">
                    <p>{formatDateToLocal(note.appointment_date)}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    <PatientName
                      last_name={note.patient.last_name}
                      first_name={note.patient.first_name}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {note.chief_complaint}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex justify-start gap-3">
                      {note.status === 'processing' && (
                        <ProcessingSOAPNote id={note.id} />
                      )}
                      {note.status === 'approved' && (
                        <ViewSOAPNote id={note.id} />
                      )}
                      {note.status === 'awaiting review' && (
                        <ReviewDraft id={note.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
