import AudioUpload from './AudioUpload';
import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: "Create New Note",
}

export default async function Page() {  
 
  return (
    <main>
      
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${GeistSans.className} text-2xl`}>SOAP Notes</h1>
      </div>
      <AudioUpload />
      
    </main>
  );
}