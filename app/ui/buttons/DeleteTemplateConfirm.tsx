'use client';

import { useRouter } from 'next/navigation';
import { DeleteButton } from '@/app/ui/Buttons';
import { deleteTemplate } from '@/app/lib/data';

export function DeleteTemplateConfirm({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteTemplate(id);

      router.push('/dashboard/templates');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  return <DeleteButton text="Delete Template" onClick={handleDelete} />;
}
