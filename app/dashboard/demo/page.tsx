import TextStreamer from '@/app/components/TextStreamer';
// import AudioUploadRecordTest from '@/app/components/AudioUploadRecordTest';
import AudioUploadRecordDemo from '@/app/components/AudioUploadRecordDemo';

export default async function Page() {
  return (
    <div className="w-full">
      <div className="mb-8 flex w-full flex-col">
        <div className="my-4">
          {/* <AudioUploadRecordTest patientId="123" /> */}
          <AudioUploadRecordDemo patientId="123" />
        </div>
        <div className="my-4">
          <TextStreamer />
        </div>
      </div>
    </div>
  );
}
