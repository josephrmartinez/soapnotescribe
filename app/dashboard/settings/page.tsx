import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import ListGenerator from '@/app/components/ListGenerator';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function Page() {
  return (
    <div className="w-full">
      <div className="mb-8 flex w-full flex-col">
        <h1 className={`${GeistSans.className} text-2xl`}>Settings</h1>
        <div className="flex flex-col">
          <ListGenerator
            listName="Appointment Types"
            listItems={[
              { id: 1, name: 'Telemedicine', default: true },
              { id: 2, name: 'In Person', default: false },
            ]}
          />
          <ListGenerator
            listName="Appointment Specialties"
            listItems={[
              { id: 1, name: 'Urgent Care', default: true },
              { id: 2, name: 'Primary Care', default: false },
            ]}
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
