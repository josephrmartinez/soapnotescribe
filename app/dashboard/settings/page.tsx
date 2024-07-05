import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import AudioUploadRecord from '@/app/components/AudioUploadRecord';

export const metadata: Metadata = {
  title: 'Account Settings',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Account Settings</h1>
      </div>
      <div className="bg-gray-50 p-6">
        <AudioUploadRecord patientId="60c52869-1b9e-49fc-9a29-3378b54fc171" />
      </div>
    </div>
  );
}
