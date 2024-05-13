import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Button } from '@/app/ui/button';

export const metadata: Metadata = {
  title: 'Patients',
};

export default function Page() {
  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Patients</h1>
      </div>

      <Button>Add Patient</Button>
    </div>
  );
}
