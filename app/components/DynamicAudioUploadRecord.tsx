import dynamic from 'next/dynamic';

const AudioUploadRecord = dynamic(() => import('./AudioUploadRecord'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function DynamicAudioUploadRecord({
  patientId,
}: {
  patientId: string;
}) {
  return <AudioUploadRecord patientId={patientId} />;
}
