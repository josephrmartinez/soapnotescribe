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
      <div className="mb-4 text-xl">
        Upload clinical audio memo or full telehealth appointment recording.
      </div>
      <div className="mb-8 text-xl">
        soapscribe will automatically draft a structured SOAP note.
      </div>
      {/* <AudioUpload /> */}
    </main>
  );
}
