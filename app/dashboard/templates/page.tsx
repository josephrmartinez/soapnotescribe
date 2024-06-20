import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { PlusLinkButton } from '@/app/ui/Buttons';
import { fetchTemplates } from '@/app/lib/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Templates',
};

export default async function Page() {
  const userTemplates = await fetchTemplates();
  console.log('userTemplates:', userTemplates);

  let userTemplatesTable: JSX.Element[] = [];
  if (userTemplates !== undefined) {
    userTemplatesTable = userTemplates.map((template) => (
      <Link
        href={`/dashboard/templates/${template.id}`}
        key={template.id}
        className="flex h-10 cursor-pointer flex-row items-center font-medium transition-all hover:text-teal-600"
      >
        <div>{template.chief_complaint}</div>
        <div className="mx-2">-</div>
        <div>{template.soap_assessment}</div>
      </Link>
    ));
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Templates</h1>
      </div>
      <PlusLinkButton href="./templates/add" text="Create Template" />
      <div className="mt-6">{userTemplatesTable}</div>
    </div>
  );
}
