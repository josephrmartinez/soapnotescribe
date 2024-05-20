import EditPatientForm from './edit-patient-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Patient Profile',
};

export default async function Page() {
  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Edit Patient Profile</h1>
      </div>
      <EditPatientForm />
    </main>
  );
}
