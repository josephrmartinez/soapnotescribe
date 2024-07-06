import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import AudioUploadRecord from '@/app/components/AudioUploadRecord';
// import AudioPlayer from '@/app/components/AudioPlayer';
import DynamicAudioUploadRecord from '@/app/components/DynamicAudioRecord';
import AudioUploadRecord from '@/app/components/AudioUploadRecord';

export const metadata: Metadata = {
  title: 'Settings',
};

// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#nextdynamic

export default function Page() {
  return (
    <div className="w-full">
      <div className="mb-8 flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Settings</h1>
        {/* <AudioUploadRecord patientId="123" /> */}
        <DynamicAudioUploadRecord />
      </div>
    </div>
  );
}
