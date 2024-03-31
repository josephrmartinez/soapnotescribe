import CreateAppointment from './create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create New Note",
}

export default async function Page() {  
 
  return (
    <main>
      <CreateAppointment />
    </main>
  );
}