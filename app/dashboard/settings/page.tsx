import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import ListGenerator from '@/app/components/ListGenerator';
import { fetchUserSettings } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  const userSettings = await fetchUserSettings();
  console.log('userSettings:', userSettings);

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

// <div>Appointment Types:</div>
//           <li>Telemedicine</li>
//           <li>In Person</li>
//           <div>
//             <div>Appointment Specialties:</div>
//             <li value="Addiction Medicine">Addiction Medicine</li>
//             <li value="Behavioral Health">Behavioral Health</li>
//             <li value="Primary Care">Primary Care</li>
//             <li value="Urgent Care">Urgent Care</li>
//             <li value="Wound Care">Wound Care</li>
//             <li value="IV Treatment">IV Treatment</li>
//             <li value="Metabolic">Metabolic</li>
//             <li value="HRT">HRT</li>
//             <li value="Aesthetics">Aesthetics</li>
//             <li value="Other">Other</li>
//             <input type="text" placeholder="add specialty"></input>
