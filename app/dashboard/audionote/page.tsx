import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import Loader from './Loader';
import { fetchUserSession } from '@/app/lib/data';
import AudioUpload from './AudioUpload';

export const metadata: Metadata = {
  title: 'Create New Note',
};

export default async function Page() {
  const session = await fetchUserSession();
  const accessToken = session?.access_token || '';
  const userID = session?.user.id || '';

  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>
          Create Note from Audio
        </h1>
      </div>
      {/* <Loader accessToken={accessToken} userID={userID} /> */}
      <AudioUpload />
    </main>
  );
}
