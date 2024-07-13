import CreateAppointment from './create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Note',
};

export default async function Page() {
  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>New Note</h1>
      </div>
      <CreateAppointment />
    </main>
  );
}
