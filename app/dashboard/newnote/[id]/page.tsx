import { Metadata } from 'next';
import CreateNotePrefilled from './create-form';
import { fetchNoteById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Review Draft',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const note = await fetchNoteById(id);
  console.log('note data from newnote/[id]/page.tsx:', note);

  return (
    <div>
      <CreateNotePrefilled note={note} />
    </div>
  );
}
