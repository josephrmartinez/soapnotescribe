import AudioUpload from './AudioUpload';
import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: "Create New Note",
}

export default async function Page() {  
 
  return (
    <main>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className={`${GeistSans.className} text-2xl`}>Create Note from Audio</h1>
      </div>
      <AudioUpload />
      
    </main>
  );
}