import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import TemplateForm from '@/app/ui/templates/template-form';
import { createTemplate } from './action';
import { fetchNoteById } from '@/app/lib/data';
import { Template } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Add Template',
};

interface PageProps {
  searchParams?: {
    noteRef?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  let template: Template = {
    user_id: '',
    id: '',
    chief_complaint: '',
    soap_subjective: '',
    soap_objective: '',
    soap_assessment: '',
    soap_plan: '',
    patient_instructions: '',
  };

  if (searchParams?.noteRef) {
    const noteRef = searchParams.noteRef;

    try {
      const note = await fetchNoteById(noteRef);

      template = {
        user_id: note.user_id,
        id: '',
        chief_complaint: note.chief_complaint || '',
        soap_subjective: note.soap_subjective || '',
        soap_objective: note.soap_objective || '',
        soap_assessment: note.soap_assessment || '',
        soap_plan: note.soap_plan || '',
        patient_instructions: note.patient_instructions || '',
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
