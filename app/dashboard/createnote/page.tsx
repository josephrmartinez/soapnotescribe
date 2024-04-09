import CreateAppointment from './create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create New Note",
}

export default async function Page() {  
 
  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={` text-2xl`}>Create New Note</h1>
      </div>
      <CreateAppointment />
    </main>
  );
}