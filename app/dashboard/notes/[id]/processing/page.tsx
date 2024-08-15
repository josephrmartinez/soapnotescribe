import { Metadata } from 'next';
import { fetchNoteById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/notes/breadcrumbs';
import ProcessingNote from './ProcessingNote';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Review Draft',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const note = await fetchNoteById(id);
  console.log('note data from notes/[id]/processing', note);

  if (note.status === 'draft') {
    redirect(`./edit`);
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Notes', href: '/dashboard/notes' },
          {
            label: `Processing`,
            href: `/dashboard/notes/${id}/processing`,
            active: true,
          },
        ]}
      />
      <ProcessingNote note={note} />
    </div>
  );
}
