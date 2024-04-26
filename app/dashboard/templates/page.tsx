import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Button } from '@/app/ui/button';

export const metadata: Metadata = {
  title: 'Templates',
};

export default function Page() {
  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Templates</h1>
      </div>

      <Button>Add Template</Button>
    </div>
  );
}
