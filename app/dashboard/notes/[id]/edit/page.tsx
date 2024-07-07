import { Metadata } from 'next';
import { fetchNoteById } from '@/app/lib/data';
import EditDraftNote from './create-form';
import Breadcrumbs from '@/app/ui/notes/breadcrumbs';

export const metadata: Metadata = {
  title: 'Review Draft',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const note = await fetchNoteById(id);
  console.log('note data from newnote/[id]/page.tsx:', note);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Notes', href: '/dashboard/notes' },
          {
            label: `Review Draft`,
            href: `/dashboard/notes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditDraftNote note={note} />
    </div>
  );
}
