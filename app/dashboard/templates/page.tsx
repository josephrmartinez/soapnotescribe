import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { PlusLinkButton } from '@/app/ui/Buttons';
import TemplateTable from '@/app/ui/templates/templatetable';
import { AppointmentsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchTemplates } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Templates',
};

export default async function Page() {
  const userTemplates = await fetchTemplates();

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Templates</h1>
      </div>
      <PlusLinkButton href="./templates/add" text="Create Template" />
      <div className="mt-6">
        <TemplateTable userTemplates={userTemplates} />
        {/* <Suspense
          key={'1234'}
          fallback={<AppointmentsTableSkeleton />}
        ></Suspense> */}
      </div>
    </div>
  );
}
