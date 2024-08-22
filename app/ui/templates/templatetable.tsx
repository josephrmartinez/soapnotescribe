import Link from 'next/link';
import { Template } from '@/app/lib/definitions';

interface TemplateTableProps {
  userTemplates: Template[];
}

export default async function TemplateTable({
  userTemplates,
}: TemplateTableProps) {
  return (
    <div className="grid max-w-prose grid-cols-1 gap-4  sm:grid-cols-2">
      {userTemplates?.map((template: Template) => (
        <div className="rounded-md border">
          <Link
            href={`/dashboard/templates/${template.id}`}
            key={template.id}
            className="fademask group grid h-48 max-w-md cursor-pointer grid-rows-6 items-center  overflow-clip rounded-md   p-2 font-medium transition-all hover:shadow"
          >
            <div className="text-xl font-semibold text-gray-700 transition-colors group-hover:text-teal-600 ">
              {template.chief_complaint}
            </div>
            <div className="text-md row-span-2 text-gray-600 transition-colors group-hover:text-teal-600">
              {template.soap_assessment}
            </div>
            <div className=" row-span-3 max-w-md  text-sm text-gray-600 group-hover:text-gray-500">
              {template.soap_plan}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
