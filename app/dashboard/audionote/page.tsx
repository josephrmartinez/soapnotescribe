import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import AudioUpload from './AudioUpload';

export const metadata: Metadata = {
  title: 'Create New Note',
};

export default async function Page() {
  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>
          Create Note from Audio
        </h1>
      </div>
      <AudioUpload />
    </main>
  );
}
