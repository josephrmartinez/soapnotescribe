import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import TemplateForm from '@/app/ui/templates/template-form';
import { createTemplate } from './action';

export const metadata: Metadata = {
  title: 'Add Template',
};

export default function Page() {
  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Add Template</h1>
      </div>
      <TemplateForm formAction={createTemplate} />
    </div>
  );
}
