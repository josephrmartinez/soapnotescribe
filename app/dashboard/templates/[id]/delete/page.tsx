'use client';

import Breadcrumbs from '@/app/ui/notes/breadcrumbs';
import { useRouter } from 'next/navigation';
import { DeleteTemplateConfirm } from '@/app/ui/buttons/DeleteTemplateConfirm';

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Template', href: `/dashboard/templates/${id}` },
          {
            label: 'Confirm Delete',
            href: `/dashboard/templates/${id}/delete`,
            active: true,
          },
        ]}
      />

      <div className="max-w-prose">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className={` text-2xl`}>Delete Template</h1>
        </div>

        <div className="mb-4 flex max-w-prose flex-col items-center rounded-md  p-4">
          <div className="mt-8 text-lg font-semibold">
            Are you sure you want to permanently delete this template?
          </div>
          <div className="my-12 grid grid-cols-2 gap-4">
            <button
              onClick={handleCancel}
              className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <DeleteTemplateConfirm id={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
