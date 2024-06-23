import Link from 'next/link';
import { Template } from '@/app/lib/definitions';

export default function TemplateTable({
  userTemplates,
}: {
  userTemplates: Template[];
}) {
  return userTemplates.map((template) => (
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
