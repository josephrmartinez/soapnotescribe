import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import ListGenerator from '@/app/components/ListGenerator';
import { fetchUserSettings } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  const userSettings = await fetchUserSettings();

  return (
    <div className="w-full">
      <div className="mb-8 flex w-full flex-col">
        <h1 className={`${GeistSans.className} text-2xl`}>Settings</h1>
        <div className="flex flex-col">
          <div className="h-12"></div>

          <ListGenerator
            listName="Appointment Types"
            fieldName="appointment_types"
            listItems={userSettings.appointment_types}
            defaultItem={userSettings.appointment_types_default}
            userId={userSettings.user_id}
          />
          <div className="h-12"></div>
          <ListGenerator
            listName="Appointment Specialties"
            fieldName="appointment_specialties"
            listItems={userSettings.appointment_specialties}
            defaultItem={userSettings.appointment_specialties_default}
            userId={userSettings.user_id}
          />
        </div>
      </div>
    </div>
  );
}
