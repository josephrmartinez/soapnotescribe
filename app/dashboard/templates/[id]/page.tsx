import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import TemplateForm from '@/app/ui/templates/template-form';
import { editTemplate } from './action';
import { fetchTemplateById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Edit Template',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const template = await fetchTemplateById(id);

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Template</h1>
      </div>
      <TemplateForm formAction={editTemplate} template={template} />
    </div>
  );
}
