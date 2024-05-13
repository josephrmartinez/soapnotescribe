import AddPatient from './add-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Patient',
};

export default async function Page() {
  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Add New Patient</h1>
      </div>
      <AddPatient />
    </main>
  );
}
