import {
  UpdateAppointment,
  ViewSOAPNote,
  ReviewDraft,
} from '@/app/ui/appointments/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredAppointments } from '@/app/lib/data';
import { useEffect } from 'react';

export default async function AppointmentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // FETCH APPTS WITH KEYWORD SEARCH
  const appointments = await fetchFilteredAppointments(query, currentPage);
  console.log('fetched appointments:', appointments);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {appointments?.map((appointment) => (
              <div
                key={appointment.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{formatDateToLocal(appointment.appointment_date)}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {appointment.patient_name}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {appointment.chief_complaint}
                    </p>
                    <p>{appointment.status}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ViewSOAPNote id={appointment.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Appointment Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Patient
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Chief Complaint
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Note Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {appointments?.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{formatDateToLocal(appointment.appointment_date)}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {appointment.patient_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {appointment.chief_complaint}
                  </td>
                  <td className="whitespace-nowrap  px-3 "></td>
                  <td className="whitespace-nowrap px-3 py-3"></td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {appointment.status === 'processing' && (
                        <div className="flex h-10 w-24 flex-row items-center">
                          <div className="loader ml-2"></div>
                        </div>
                      )}
                      {appointment.status === 'approved' && (
                        <ViewSOAPNote id={appointment.id} />
                      )}
                      {appointment.status === 'awaiting review' && (
                        <ReviewDraft id={appointment.id} />
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

// FETCH APPOINTMENTS WITH REALTIME
// export async function fetchFilteredAppointments(
//   query: string,
//   currentPage: number,
// ) {
//   noStore();
//   try {
//     const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//     const supabase = createClient();
//     const { data: appointments, error } = await supabase
//       .from('appointments')
//       .select(
//         'id, status, created_at, patient_name, appointment_date, chief_complaint, audio_transcript',
//       )
//       // .ilike('audio_transcript', `%${query}%`)
//       .order('appointment_date', { ascending: false })
//       .range(offset, offset + ITEMS_PER_PAGE - 1);

//     if (error) {
//       console.error('Error fetching appointments:', error);
//       return;
//     }

//     // IMPLEMENT SUPABASE REALTIME UPDATES
//     //   const subscription = supabase.realtime
//     // .from('appointments')
//     // .on('*', async () => {
//     //     const { data: updatedAppointments, error: updateError } = await supabase
//     //       .from('appointments')
//     //       .select(
//     //         'id, status, created_at, patient_name, appointment_date, chief_complaint, audio_transcript'
//     //       )
//     //       .order('appointment_date', { ascending: false })
//     //       .range(offset, offset + ITEMS_PER_PAGE - 1);

//     //     if (updateError) {
//     //       console.error('Error updating appointments:', updateError);
//     //       return;
//     //     }

//     // Implement custom sorting logic: processing at top, then "awaiting review", then "approved"
//     // TODO: Update table to delineate these groupings?
//     appointments.sort((a, b) => {
//       // Prioritize "processing" status
//       if (a.status === 'processing' && b.status !== 'processing') {
//         return -1;
//       } else if (a.status !== 'processing' && b.status === 'processing') {
//         return 1;
//       }

//       // Then prioritize "awaiting review" status
//       if (a.status === 'awaiting review' && b.status !== 'awaiting review') {
//         return -1;
//       } else if (
//         a.status !== 'awaiting review' &&
//         b.status === 'awaiting review'
//       ) {
//         return 1;
//       }

//       // Finally, sort by status and then by appointment_date
//       if (a.status === b.status) {
//         // If both appointments have the same status, sort by appointment_date
//         // Since we know there will be no null appointment_date values, we can directly create Date objects
//         const aDate = new Date(a.appointment_date);
//         const bDate = new Date(b.appointment_date);
//         return bDate.getTime() - aDate.getTime(); // Sort in descending order
//       }

//       // Default return value if none of the above conditions are met
//       return 0;
//     });

//     return appointments;
//   } catch (error) {
//     console.error('Supabase Error:', error);
//     throw new Error('Failed to fetch appointments data.');
//   }
// }
