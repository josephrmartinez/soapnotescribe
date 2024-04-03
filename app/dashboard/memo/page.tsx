import AudioUpload from './AudioUpload';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create New Note",
}

export default async function Page() {  
 
  return (
    <main>
      <AudioUpload />
    </main>
  );
}