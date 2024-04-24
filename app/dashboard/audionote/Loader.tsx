'use client';
import React, { useState, useEffect } from 'react';
import Uppy, { PluginOptions, UploadResult, UppyFile } from '@uppy/core';
import Tus from '@uppy/tus';
import Dashboard from '@uppy/react/lib/Dashboard';
// import { Dashboard } from '@uppy/react';
import Audio from '@uppy/audio';

import { v4 as uuidv4 } from 'uuid';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/audio/dist/style.min.css';

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const STORAGE_BUCKET = 'audiofiles'; // your storage bucket name

const supabaseStorageURL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/upload/resumable`;

const tusConfig = {
  endpoint: supabaseStorageURL,
  headers: {
    authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    apikey: SUPABASE_ANON_KEY,
  },
  uploadDataDuringCreation: true,
  chunkSize: 6 * 1024 * 1024,
  allowedMetaFields: [
    'bucketName',
    'objectName',
    'contentType',
    'cacheControl',
  ],
  removeFingerprintOnSuccess: true,
  onerror: (error: any) => console.log('tus error', error),
};

export default function Loader() {
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const generateFileName = () => {
    const uuid = uuidv4();
    const name = uuid.substring(0, 16);
    console.log('generated name', name);
    return name;
  };

  const renameFile = (currentFile: UppyFile, files: any) => {
    const modifiedFile = {
      ...currentFile,
      name: generateFileName(),
    };
    setTemplateName(currentFile.name);
    console.log('Uploading file: ', modifiedFile.name);
    return modifiedFile;
  };

  const handleUploadResult = (result: UploadResult) => {
    console.log('Upload result:', result);
    if (result.failed.length > 0) {
      console.log('Upload failed', result.failed);
      return;
    } else if (result.successful.length > 0) {
      setIsUploadComplete(true);
      setTmpUploadFileName(`${result.successful[0].name}`);
    }
  };

  // IMPORTANT: passing an initializer function to prevent Uppy from being reinstantiated on every render.
  const [uppy] = useState(() =>
    new Uppy({
      onBeforeFileAdded: renameFile,
      allowMultipleUploadBatches: false,
      restrictions: {
        maxFileSize: 10000000, // 10mb
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        // allowedFileTypes: ["application/pdf"],
      },
      autoProceed: true,
    }).use(Tus, tusConfig),
  );

  uppy.on('file-added', (file) => {
    const supabaseMetadata = {
      bucketName: STORAGE_BUCKET,
      objectName: `uploads/${file.name}`,
      contentType: file.type,
    };

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };

    console.log('file added', file);
  });

  // uppy.on("upload-success", (file, response) => {
  //   console.log("Upload success", file, response);
  // });

  uppy.on('complete', handleUploadResult);

  return (
    <>
      {isUploadComplete && <div>Upload Complete!</div>}
      {!isUploadComplete && (
        <Dashboard width={600} height={400} uppy={uppy} plugins={['Audio']} />
      )}
    </>
  );
}

// Demo: https://codesandbox.io/p/sandbox/react-uppy-example-fizg4s?file=%2Fcomponents%2FWorkingUploader.js%3A7%2C4

// export default function Loader() {
// const [uppy] = useState(() => new Uppy().use(Audio));

//  return (
//    <div className='h-12'>
//      <Dashboard
//        uppy={uppy}
//        height={350}
//        width={698}
//       plugins={['Audio']}

//     />
//    </div>

//  );
// };
