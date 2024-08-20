import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import TemplateForm from '@/app/ui/templates/template-form';
import { createTemplate } from './action';
import { fetchNoteById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Add Template',
};

interface Template {
  id: string;
  chief_complaint: string;
  soap_subjective: string;
  soap_objective: string;
  soap_assessment: string;
  soap_plan: string;
}

interface PageProps {
  searchParams?: {
    noteRef?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  let template: Template = {
    id: '',
    chief_complaint: '',
    soap_subjective: '',
    soap_objective: '',
    soap_assessment: '',
    soap_plan: '',
  };

  if (searchParams?.noteRef) {
    const noteRef = searchParams.noteRef;

    try {
      const note = await fetchNoteById(noteRef);

      template = {
        id: '',
        chief_complaint: note.chief_complaint || '',
        soap_subjective: note.soap_subjective || '',
        soap_objective: note.soap_objective || '',
        soap_assessment: note.soap_assessment || '',
        soap_plan: note.soap_plan || '',
      };
    } catch (error) {
      console.error('Unable to fetch note with noteRef', error);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Add Template</h1>
      </div>
      <TemplateForm formAction={createTemplate} template={template} />
    </div>
  );
}
