import { Metadata } from 'next';
import { fetchPatientById } from '@/app/lib/data';
// import { editPatient } from './action';
import { checkForExistingPatient, editPatient } from '@/app/lib/data';
import PatientForm from '@/app/ui/patients/patient-form';

export const metadata: Metadata = {
  title: 'Edit Patient Profile',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const patient = await fetchPatientById(id);
  console.log(patient);

  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className={` text-2xl`}>Edit Patient Profile</h1>
      </div>
      <PatientForm patient={patient} />
    </main>
  );
}
