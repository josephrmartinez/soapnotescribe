import Link from 'next/link';
import { Template } from '@/app/lib/definitions';
import { fetchTemplates } from '@/app/lib/data';

export default async function TemplateTable() {
  const userTemplates = await fetchTemplates();

  return (
    <div>
      {userTemplates?.map((template: Template) => (
        <Link
          href={`/dashboard/templates/${template.id}`}
          key={template.id}
          className="flex h-10 cursor-pointer flex-row items-center font-medium transition-all hover:text-teal-600"
        >
          <div>{template.chief_complaint}</div>
          <div className="mx-2">-</div>
          <div>{template.soap_assessment}</div>
        </Link>
      ))}
    </div>
  );
}
