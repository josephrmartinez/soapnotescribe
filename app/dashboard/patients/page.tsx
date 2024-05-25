import Search from '@/app/ui/search';
import { GeistSans } from 'geist/font/sans';
import { AppointmentsTableSkeleton } from '@/app/ui/skeletons';
import { Button } from '@/app/ui/button';
import { AddPatientButton } from '@/app/ui/patients/buttons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import PatientsTable from '@/app/ui/patients/table';
import { PlusIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'SOAP Notes',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  // Add function to search total number of patients under provider. If 0, display onboarding note

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Patients</h1>
      </div>

      <div className="flex w-full flex-row gap-4">
        <Search placeholder="Search patients..." />
        <AddPatientButton />
      </div>

      <Suspense key={query} fallback={<AppointmentsTableSkeleton />}>
        <PatientsTable query={query} />
      </Suspense>
      {/* <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}

// const ITEMS_PER_PAGE = 6;
// const offset = (currentPage - 1) * ITEMS_PER_PAGE;

// const supabase = createClient();

// const { data: appointments, error } = await supabase
//   .from('appointments')
//   .select(
//     'id, status, created_at, patient_name, appointment_date, chief_complaint, audio_transcript',
//   )
//   // .ilike('audio_transcript', `%${query}%`)
//   .order('appointment_date', { ascending: false })
//   .range(offset, offset + ITEMS_PER_PAGE - 1);

//   if (error) {
//     console.error('Error fetching appointments:', error);
//     return;
//   }

//   appointments.sort((a, b) => {
//     // Prioritize "processing" status
//     if (a.status === 'processing' && b.status !== 'processing') {
//       return -1;
//     } else if (a.status !== 'processing' && b.status === 'processing') {
//       return 1;
//     }

//     // Then prioritize "awaiting review" status
//     if (a.status === 'awaiting review' && b.status !== 'awaiting review') {
//       return -1;
//     } else if (
//       a.status !== 'awaiting review' &&
//       b.status === 'awaiting review'
//     ) {
//       return 1;
//     }

//     // Finally, sort by status and then by appointment_date
//     if (a.status === b.status) {
//       // If both appointments have the same status, sort by appointment_date
//       // Since we know there will be no null appointment_date values, we can directly create Date objects
//       const aDate = new Date(a.appointment_date);
//       const bDate = new Date(b.appointment_date);
//       return bDate.getTime() - aDate.getTime(); // Sort in descending order
//     }

//     // Default return value if none of the above conditions are met
//     return 0;
//   });

// import Pagination from '@/app/ui/appointments/pagination';
// import Search from '@/app/ui/search';
// import { GeistSans } from 'geist/font/sans';
// import { AppointmentsTableSkeleton } from '@/app/ui/skeletons';
// import { Suspense } from 'react';
// import { GetServerSidePropsContext, Metadata } from 'next';
// import NotesTable from './realtimetable';
// import { createClient } from '@/utils/supabase/server';
// import { Appointment } from '@/app/lib/definitions';
// // import Table from '@/app/ui/appointments/table';
// // import { CreateAppointment } from '@/app/ui/appointments/buttons';
// // import { fetchApptsPages } from '@/app/lib/data';

// export const metadata: Metadata = {
//   title: 'SOAP Notes',
// };

// interface PageProps {
//   appointments: Appointment[];
//   totalPages: number;
//   currentPage: number;
//   error: boolean;
// }

// // This function runs on the server side before rendering the page
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { query } = context;
//   const currentPage = Number(query.page) || 1;
//   const ITEMS_PER_PAGE = 6;
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   const supabase = createClient();

//   const { data: appointments, error } = await supabase
//     .from('appointments')
//     .select(
//       'id, status, created_at, patient_name, appointment_date, chief_complaint, audio_transcript',
//     )
//     .ilike('audio_transcript', `%${query}%`)
//     .order('appointment_date', { ascending: false })
//     .range(offset, offset + ITEMS_PER_PAGE - 1);

//   if (error) {
//     console.error('Error fetching appointments:', error);
//     return { props: { appointments: [], error: true } };
//   }

//   appointments.sort((a, b) => {
//     // Prioritize "processing" status
//     if (a.status === 'processing' && b.status !== 'processing') {
//       return -1;
//     } else if (a.status !== 'processing' && b.status === 'processing') {
//       return 1;
//     }

//     // Then prioritize "awaiting review" status
//     if (a.status === 'awaiting review' && b.status !== 'awaiting review') {
//       return -1;
//     } else if (
//       a.status !== 'awaiting review' &&
//       b.status === 'awaiting review'
//     ) {
//       return 1;
//     }

//     // Finally, sort by status and then by appointment_date
//     if (a.status === b.status) {
//       // If both appointments have the same status, sort by appointment_date
//       // Since we know there will be no null appointment_date values, we can directly create Date objects
//       const aDate = new Date(a.appointment_date);
//       const bDate = new Date(b.appointment_date);
//       return bDate.getTime() - aDate.getTime(); // Sort in descending order
//     }

//     // Default return value if none of the above conditions are met
//     return 0;
//   });

//   // Assuming you have a way to calculate total pages, for example, based on the total number of appointments
//   const totalPages = 3; // This should be dynamically calculated based on the total number of appointments

//   return {
//     props: {
//       appointments,
//       totalPages,
//       currentPage,
//       error: false,
//     },
//   };
// }

// export default function Page({
//   appointments,
//   totalPages,
//   currentPage,
//   error,
// }: PageProps) {
//   if (error) {
//     return <div>Error loading appointments</div>;
//   }

//   return (
//     <div className="w-full">
//       <div className="mb-8 flex w-full items-center justify-between">
//         <h1 className={`${GeistSans.className} text-2xl`}>SOAP Notes</h1>
//       </div>
//       <Search placeholder="Search notes..." />
//       {/* <Suspense
//         key={query + currentPage}
//         fallback={<AppointmentsTableSkeleton />}
//       >
//         <Table query={query} currentPage={currentPage} />
//       </Suspense> */}
//       <NotesTable appointments={appointments} />
//       <div className="mt-5 flex w-full justify-center">
//         <Pagination totalPages={totalPages} />
//       </div>
//     </div>
//   );
// }
