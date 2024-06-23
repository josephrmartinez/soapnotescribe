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
