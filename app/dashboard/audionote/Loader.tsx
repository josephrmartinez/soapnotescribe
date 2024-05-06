'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Uppy, { PluginOptions, UploadResult, UppyFile } from '@uppy/core';
import Tus from '@uppy/tus';
import Dashboard from '@uppy/react/lib/Dashboard';
// import { Dashboard } from '@uppy/react';
import Audio from '@uppy/audio';
import { v4 as uuidv4 } from 'uuid';
import { getReplicateMonoTranscript } from '@/app/lib/actions';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/audio/dist/style.min.css';

const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const NEXT_PUBLIC_SUPABASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
const STORAGE_BUCKET = 'audiofiles'; // your storage bucket name

const supabaseStorageURL = `https://${NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/upload/resumable`;

export default function Loader({
  accessToken,
  userID,
}: {
  accessToken: string;
  userID: string;
}) {
  // const [fileName, setFileName] = useState<string>('');
  const router = useRouter();

  const supabase = createClient();

  const generateFileName = () => {
    const uuid = uuidv4();
    const name = uuid.substring(0, 16);
    return name;
  };

  const renameFile = (currentFile: UppyFile, files: any) => {
    const modifiedFile = {
      ...currentFile,
      name: generateFileName(),
    };
    // setFileName(modifiedFile.name);
    return modifiedFile;
  };

  async function getDownloadUrl(fileName: string) {
    try {
      const { data, error } = await supabase.storage
        .from('audiofiles')
        .createSignedUrl(`${userID}/${fileName}`, 600);

      if (error) {
        console.log('Error getting signed URL:', error);
      } else {
        return data?.signedUrl;
      }
    } catch (error) {
      console.error('Error generating signedUrl:', error);
    }
  }

  const handleUploadResult = async (result: UploadResult) => {
    console.log('Upload result:', result);
    if (result.failed.length > 0) {
      console.log('Upload failed', result.failed);
      return;
    } else if (result.successful.length > 0) {
      // setIsUploadComplete(true);

      try {
        const signedUrl = await getDownloadUrl(result.successful[0].name);

        // Check if signedUrl is defined before setting the state
        if (signedUrl !== undefined) {
          console.log('signedUrl:', signedUrl);
          updateSupabaseTable(result.successful[0].name, signedUrl);
          // } else {
          //   console.error('Error: Signed URL is undefined');
        }
      } catch (error) {
        console.error('Error fetching signed URL:', error);
      }
    }
  };

  async function updateSupabaseTable(
    audio_storage_url: string,
    temp_audio_url: string,
  ) {
    console.log('calling updateSupabaseTable');
    try {
      const { error, data } = await supabase
        .from('appointments')
        .insert({
          user_id: userID,
          audio_storage_url,
          temp_audio_url,
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
    }
  }

  // passing an initializer function to prevent Uppy from being reinstantiated on every render.
  const [uppy] = useState(() =>
    new Uppy({
      onBeforeFileAdded: renameFile,
      allowMultipleUploadBatches: false,
      restrictions: {
        maxFileSize: 50000000, // 50mb
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ['audio/*'],
      },
      autoProceed: false,
    })
      .use(Tus, {
        endpoint: supabaseStorageURL,
        headers: {
          authorization: `Bearer ${accessToken}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: [
          'bucketName',
          'objectName',
          'contentType',
          'cacheControl',
        ],
        // removeFingerprintOnSuccess: true,
      })
      .use(Audio),
  );

  uppy.on('file-added', (file) => {
    const supabaseMetadata = {
      bucketName: STORAGE_BUCKET,
      objectName: `${userID}/${file.name}`,
      contentType: file.type,
      cacheControl: '3600',
    };

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };
    // console.log('file added', file);
  });

  uppy.on('upload-success', (file, response) => {
    console.log('Upload success', file, response);
  });

  uppy.on('complete', handleUploadResult);

  return (
    <>
      <Dashboard width={600} height={400} uppy={uppy} plugins={['Audio']} />
    </>
  );
}
