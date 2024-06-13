import { Metadata } from 'next';
import { fetchNoteById } from '@/app/lib/data';
import EditDraftNote from './create-form';

export const metadata: Metadata = {
  title: 'Review Draft',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const note = await fetchNoteById(id);
  // console.log('note data from newnote/[id]/page.tsx:', note);

  return (
    <div>
      <EditDraftNote note={note} />
    </div>
  );
}
