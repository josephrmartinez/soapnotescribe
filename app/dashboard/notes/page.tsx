import Pagination from '@/app/ui/notes/pagination';
import Search from '@/app/ui/search';
import { GeistSans } from 'geist/font/sans';
import { AppointmentsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import NotesTable from './realtimetable';
import { createClient } from '@/utils/supabase/server';
import { fetchFilteredNotes } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'SOAP Notes',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  // const totalPages = await fetchApptsPages(query);
  const totalPages = 3;

  const notes = (await fetchFilteredNotes(query, currentPage)) || [];

  console.log('notes data:', notes);

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>SOAP Notes</h1>
      </div>
      <Search placeholder="Search notes..." />
      <Suspense
        key={query + currentPage}
        fallback={<AppointmentsTableSkeleton />}
      >
        <NotesTable notes={notes} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
