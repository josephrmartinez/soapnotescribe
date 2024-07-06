import dynamic from 'next/dynamic';

const AudioUploadRecord = dynamic(() => import('./AudioUploadRecord'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function DynamicAudioUploadRecord() {
  return <AudioUploadRecord patientId="123" />;
}
