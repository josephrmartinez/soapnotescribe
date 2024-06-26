import { fetchPatients } from '@/app/lib/data';
import { ViewProfile, ViewNotes, NewNote, PatientNameLink } from './buttons';

export default async function PatientsTable({ query }: { query: string }) {
  // UPDATE TABLE TO FETCH PATIENTS WITH QUERY KEYWORD SEARCH

  // CURRENT IMPLEMENTATION FETCHES ALL PATIENTS. QUERY SEARCH NOT ENABLED
  const patients = await fetchPatients();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {patients?.map((patient) => (
              <div
                key={patient.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex w-full items-center justify-between pb-4">
                  <PatientNameLink
                    patient_id={patient.id}
                    first_name={patient.first_name}
                    last_name={patient.last_name}
                  />

                  <ViewNotes
                    patient_name={`${patient.first_name} ${patient.last_name}`}
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div>
                    <ViewProfile patient_id={patient.id} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <NewNote patient_id={patient.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="max-h-[120] overflow-y-auto">
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="sticky top-0 w-full rounded-lg text-left text-sm font-normal">
                <tr className="sticky top-0 w-full bg-gray-50 ">
                  <th scope="col" className="px-4 py-5 font-medium">
                    Patient Name
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Patient Profile
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    View Notes
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Create Note
                  </th>
                </tr>
              </thead>
              <tbody className=" bg-white">
                {patients?.map((patient) => (
                  <tr
                    key={patient.id}
                    className="h-16 w-full border-b text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div>
                        <PatientNameLink
                          patient_id={patient.id}
                          first_name={patient.first_name}
                          last_name={patient.last_name}
                        />
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 font-medium">
                      <ViewProfile patient_id={patient.id} />
                    </td>
                    <td className="">
                      <ViewNotes
                        patient_name={`${patient.first_name} ${patient.last_name}`}
                      />
                    </td>
                    <td className="">
                      <NewNote patient_id={patient.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
