import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import AudioRecorder from '@/app/components/AudioRecorder';

export const metadata: Metadata = {
  title: 'Account Settings',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full">
        <h1 className={`${GeistSans.className} text-2xl`}>Account Settings</h1>
      </div>
      <div>Display time: 24h / 12h</div>
      <div>
        Include differential diagnosis with SOAP note draft enable / disable
      </div>
      <AudioRecorder />
    </div>
  );
}
