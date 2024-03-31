import { Metadata } from 'next';
import CreateAppointmentPrefilled from './create-form';
import { fetchAppointmentById } from '@/app/lib/data';

export const metadata: Metadata = {
  title: "Create New Note",
}


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const appointment = await fetchAppointmentById(id)
    console.log("appointment data from create/[id]/page.tsx:", appointment)
 
  return (
    <div>
      <CreateAppointmentPrefilled appointment={appointment}/>
    </div>
  );
}