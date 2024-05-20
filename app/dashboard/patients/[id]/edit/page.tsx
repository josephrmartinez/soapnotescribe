import { Metadata } from 'next';
import EditPatientForm from './edit-patient-form';
import { fetchPatientById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Edit Patient Profile',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const patient = await fetchPatientById(id);

  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Edit Patient Profile</h1>
      </div>
      <EditPatientForm patient={patient} />
    </main>
  );
}
