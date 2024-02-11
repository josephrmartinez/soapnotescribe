import { UpdateAppointment, ReadAppointment } from '@/app/ui/appointments/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredAppointments } from '@/app/lib/data';

export default async function AppointmentsTable({
  query,
  currentPage
}: {
  query: string;
  currentPage: number;
}) {
  const appointments = await fetchFilteredAppointments(query, currentPage);

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
                      <p>{formatDateToLocal(appointment.date)}</p>
                    </div>
                    <p className="text-sm text-gray-500">{appointment.clinic}</p>
                  </div>
                  
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {appointment.title}
                    </p>
                    <p>{appointment.provider}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ReadAppointment id={appointment.id} />
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Clinic
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Provider
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Appointment Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                   
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
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
                      <p>{formatDateToLocal(appointment.date)}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {appointment.clinic}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {appointment.provider}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                  {appointment.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                   
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ReadAppointment id={appointment.id} />
                      
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
