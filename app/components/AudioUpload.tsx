'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as tus from 'tus-js-client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { getReplicateMonoTranscript } from '@/app/lib/actions';
import AudioRecorder from '@/app/components/AudioRecorder';
import { revalidatePath } from 'next/cache';

export default function AudioUpload({ patientId }: { patientId: string }) {
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();
  const accessTokenRef = useRef<string | undefined>('');
  const userIDRef = useRef<string | undefined>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [component, setComponent] = useState<string>('record');

  const handleComponentChange = (selectedComponent: string) => {
    setComponent(selectedComponent);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      } else {
        userIDRef.current = data.session?.user.id;
        accessTokenRef.current = data.session?.access_token;
      }
    };

    fetchUser();
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleAudioUpload(files[0]);
    }
  };

  const triggerFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleAudioUpload(e.target.files[0]);
    }
  };

  async function getDownloadUrl(fileName: string) {
    const { data, error } = await supabase.storage
      .from('audiofiles')
      .createSignedUrl(`${userIDRef.current}/${fileName}`, 600);
    return data?.signedUrl;
  }

  async function handleAudioUpload(file: File | null) {
    if (!file) return;

    // if (!file.name.endsWith('.mp3')) {
    //   alert('Please upload an mp3 file.');
    //   return;
    // }

    try {
      setIsUploading(true);
      const randomPrefix = Math.floor(Math.random() * 900000) + 100000;
      const fileNameWithPrefix = `${randomPrefix}_${file.name}`;
      await uploadFile('audiofiles', fileNameWithPrefix, file);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  }

  async function uploadFile(bucketName: string, fileName: string, file: File) {
    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `https://grjecfvldxcnvhmjpvmu.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${accessTokenRef.current}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName,
          objectName: `${userIDRef.current}/${fileName}`,
          contentType: file.type,
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024,
        onError: function (error) {
          console.log('Failed because: ' + error);
          reject(error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setPercentageUploaded(parseFloat(percentage));
          console.log(bytesUploaded, bytesTotal, percentage + '%');
        },
        onSuccess: async function () {
          setUploadComplete(true);
          try {
            const signedUrl = await getDownloadUrl(fileName);
            console.log('signedUrl:', signedUrl);

            // Check if signedUrl is defined before setting the state
            if (signedUrl !== undefined) {
              createNote(fileName, signedUrl);
            } else {
              console.error('Error: Signed URL is undefined');
            }
          } catch (error) {
            console.error('Error fetching signed URL:', error);
          }
          resolve(null); // CHECK EFFECT OF NULL
        },
      });

      // Check if there are any previous uploads to continue.
      upload.findPreviousUploads().then(function (previousUploads) {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      });
    });
  }

  async function createNote(audio_storage_url: string, temp_audio_url: string) {
    console.log('calling createNote');
    try {
      const { error, data } = await supabase
        .from('note')
        .insert({
          user_id: userIDRef.current as string,
          audio_storage_url,
          temp_audio_url,
          patient_id: patientId,
        })
        .select();

      if (error) {
        console.error('Error inserting into Supabase table:', error);
      }

      //   Call Replicate prediction with webhook
      data && getReplicateMonoTranscript(temp_audio_url, data[0].id);

      // Redirect to page for new note
      data && router.push(`/dashboard/notes`);
    } catch (error) {
      console.error('Failed to upload to Supabase table:', error);
      // Display error message to user
      revalidatePath(`/dashboard/notes`);
    }
  }

  const uploadAudioRecording = async (blob: Blob) => {
    setIsUploading(true);

    // Create randomized file name for in-browser created recordings
    let fileName = 'recording-' + self.crypto.randomUUID();

    const file = new File([blob], fileName);

    await uploadFile('audiofiles', fileName, file);
    setIsUploading(false);
  };

  return (
    <div className="mb-6">
      <div className="mb-2 block text-sm font-medium">Audio Input</div>
      <ComponentSelect
        component={component}
        setComponent={handleComponentChange}
      />

      {component === 'upload' && (
        <div className="">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInputClick}
            role="button"
            tabIndex={0}
            className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border bg-gray-50 p-4 text-center text-sm text-gray-600 focus:ring-2 ${isDragging ? 'ring-2' : 'ring-0'}  `}
          >
            {!isUploading && !uploadComplete && (
              <div>
                <div className="hidden sm:block">
                  Click or drag and drop your audio file here
                </div>
                <div className="sm:hidden">Click to upload audio file</div>
              </div>
            )}
            {isUploading && !uploadComplete && (
              <div className="">
                Audio uploading: {`${percentageUploaded}% complete`}
              </div>
            )}
            {uploadComplete && <div className="">Transcribing audio...</div>}
          </div>
          <input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {component === 'record' && (
        <div className="">
          {/* <div className="mb-2 block text-sm font-medium">Record Audio</div> */}
          <AudioRecorder uploadAudioRecording={uploadAudioRecording} />
        </div>
      )}
    </div>
  );
}

interface ComponentSelectProps {
  setComponent: (selectedComponent: string) => void;
  component: string | undefined;
}

const ComponentSelect: React.FC<ComponentSelectProps> = ({
  setComponent,
  component,
}) => {
  const handleComponentChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedComponent = event.target.value;
    setComponent(selectedComponent);
  };

  return (
    <select
      value={component}
      name="component"
      onChange={handleComponentChange}
      className="text-md peer mb-4 block w-full cursor-pointer rounded-md border border-gray-200 py-2 outline-2 placeholder:text-gray-500"
    >
      <option value="record">Record Audio</option>
      <option value="upload">Upload Audio</option>
      <option value="none">No Audio</option>
    </select>
  );
};
