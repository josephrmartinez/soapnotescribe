'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as tus from 'tus-js-client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { getReplicateMonoTranscript } from '@/app/lib/actions';

export default function AudioUpload() {
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();
  const accessTokenRef = useRef<string | undefined>('');
  const userIDRef = useRef<string | undefined>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (!file.name.endsWith('.mp3')) {
      alert('Please upload an mp3 file.');
      return;
    }

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
              uploadToSupabaseTable(fileName, signedUrl);
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

  async function uploadToSupabaseTable(
    audio_storage_url: string,
    temp_audio_url: string,
  ) {
    try {
      const { error, data } = await supabase
        .from('appointments')
        .insert({
          user_id: userIDRef.current as string,
          created_at: new Date().toISOString(),
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

  return (
    <div className="h-96">
      <div className="items-left flex flex-col">
        <div className="mb-4 text-xl">
          Upload clinical audio memo or full telehealth appointment recording.
        </div>
        <div className="mb-8 text-xl">
          soapscribe will automatically draft a structured SOAP note.
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInputClick}
          role="button"
          tabIndex={0}
          className={`flex h-48 max-w-prose cursor-pointer flex-col items-center justify-center rounded-md border bg-gray-50 p-4 text-center text-sm text-gray-600 focus:ring-2 ${isDragging ? 'ring-2' : 'ring-0'}  `}
        >
          {!isUploading && !uploadComplete && (
            <div className="">Click or drag and drop your audio file here</div>
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
          ref={fileInputRef} // Step 1: Add a hidden file input element
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

// import React, { useState, useRef, useEffect } from 'react';
// import * as tus from 'tus-js-client';
// import { createClient } from '@/utils/supabase/client';
// import { useRouter } from 'next/navigation';
// import { getReplicateMonoTranscript } from '@/app/lib/actions';

// export default function AudioUpload() {
//   const dropAreaRef = useRef<HTMLDivElement>(null);
//   const [uploadComplete, setUploadComplete] = useState(false);
//   const [percentageUploaded, setPercentageUploaded] = useState(0);
//   const [userID, setUserID] = useState<string | undefined>('');
//   const [accessToken, setAccessToken] = useState<string | undefined>('');
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [isDragging, setIsDragging] = useState<boolean>(false);
//   const router = useRouter();
//   const accessTokenRef = useRef<string | undefined>('');

//   // const [loading, setLoading] = useState(true)
//   // const inputFileRef = useRef<HTMLInputElement>(null);

//   const supabase = createClient();

//   useEffect(() => {
//     console.log('running fetch user useEffect');
//     const fetchUser = async () => {
//       const { data, error } = await supabase.auth.getSession();
//       if (error) {
//         console.error(error);
//       } else {
//         setUserID(data.session?.user.id);
//         // setAccessToken(data.session?.access_token);
//         accessTokenRef.current = data.session?.access_token;
//       }
//     };

//     fetchUser();
//   }, []);

//   // useEffect(() => {
//   //   console.log('accessToken', accessToken);
//   // }, [accessToken]);

//   useEffect(() => {
//     const dropArea = dropAreaRef.current;
//     if (!dropArea) return;

//     const handleDragOver = (e: DragEvent) => {
//       e.preventDefault();
//       setIsDragging(true);
//     };

//     const handleDragLeave = () => {
//       setIsDragging(false);
//     };

//     const handleDrop = (e: DragEvent) => {
//       e.preventDefault();
//       setIsDragging(false);

//       if (e.dataTransfer) {
//         const files = e.dataTransfer.files;
//         if (files.length > 0) {
//           handleAudioUpload(files[0]);
//         }
//       }
//     };

//     dropArea.addEventListener('dragover', handleDragOver);
//     dropArea.addEventListener('dragleave', handleDragLeave);
//     dropArea.addEventListener('drop', handleDrop);

//     return () => {
//       dropArea.removeEventListener('dragover', handleDragOver);
//       dropArea.removeEventListener('dragleave', handleDragLeave);
//       dropArea.removeEventListener('drop', handleDrop);
//     };
//   }, []);

//   async function handleAudioUpload(file: File | null) {
//     console.log('calling handleAudioUpload');
//     if (!file) return;

//     if (!file.name.endsWith('.mp3')) {
//       alert('Please upload an mp3 file.');
//       return;
//     }

//     try {
//       setIsUploading(true);

//       // console.log('access token:', accessToken);
//       console.log('access tokenRef:', accessTokenRef.current);

//       const randomPrefix = Math.floor(Math.random() * 900000) + 100000;
//       const fileNameWithPrefix = `${randomPrefix}_${file.name}`;

//       await uploadFile('audiofiles', `${fileNameWithPrefix}`, file);

//       setIsUploading(false);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       setIsUploading(false);
//     }
//   }

//   async function getDownloadUrl(fileName: string) {
//     const { data, error } = await supabase.storage
//       .from('audiofiles')
//       .createSignedUrl(`${userID}/${fileName}`, 600);
//     return data?.signedUrl;
//   }

//   async function uploadFile(bucketName: string, fileName: string, file: File) {
//     return new Promise((resolve, reject) => {
//       const upload = new tus.Upload(file, {
//         endpoint: `https://grjecfvldxcnvhmjpvmu.supabase.co/storage/v1/upload/resumable`,
//         retryDelays: [0, 3000, 5000, 10000, 20000],
//         headers: {
//           authorization: `Bearer ${accessTokenRef.current}`,
//           'x-upsert': 'true',
//         },
//         uploadDataDuringCreation: true,
//         removeFingerprintOnSuccess: true,
//         metadata: {
//           bucketName,
//           objectName: `${userID}/${fileName}`,
//           contentType: file.type,
//           cacheControl: '3600',
//         },
//         chunkSize: 6 * 1024 * 1024,
//         onError: function (error) {
//           console.log('Failed because: ' + error);
//           reject(error);
//         },
//         onProgress: function (bytesUploaded, bytesTotal) {
//           var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
//           setPercentageUploaded(parseFloat(percentage));
//           console.log(bytesUploaded, bytesTotal, percentage + '%');
//         },
//         onSuccess: async function () {
//           setUploadComplete(true);
//           try {
//             const signedUrl = await getDownloadUrl(fileName);
//             console.log('signedUrl:', signedUrl);

//             // Check if signedUrl is defined before setting the state
//             if (signedUrl !== undefined) {
//               uploadToSupabaseTable(fileName, signedUrl);
//             } else {
//               console.error('Error: Signed URL is undefined');
//             }
//           } catch (error) {
//             console.error('Error fetching signed URL:', error);
//           }
//           resolve(null); // CHECK EFFECT OF NULL
//         },
//       });

//       // Check if there are any previous uploads to continue.
//       upload.findPreviousUploads().then(function (previousUploads) {
//         if (previousUploads.length) {
//           upload.resumeFromPreviousUpload(previousUploads[0]);
//         }

//         upload.start();
//       });
//     });
//   }

//   async function uploadToSupabaseTable(
//     audio_storage_url: string,
//     temp_audio_url: string,
//   ) {
//     try {
//       const { error, data } = await supabase
//         .from('appointments')
//         .insert({
//           user_id: userID as string,
//           created_at: new Date().toISOString(),
//           audio_storage_url,
//           temp_audio_url,
//         })
//         .select();

//       if (error) {
//         console.error('Error inserting into Supabase table:', error);
//       }

//       //   Call Replicate prediction with webhook
//       data && getReplicateMonoTranscript(temp_audio_url, data[0].id);

//       // Redirect to page for new note
//       data && router.push(`/dashboard/notes`);
//     } catch (error) {
//       console.error('Failed to upload to Supabase table:', error);
//     }
//   }

//   return (
//     <div className="h-96">
//       <div className="items-left flex flex-col">
//         <div className="mb-4 text-xl">
//           Upload clinical audio memo or full telehealth appointment recording.
//         </div>
//         <div className="mb-8 text-xl">
//           soapscribe will automatically draft a structured SOAP note.
//         </div>

//         <div
//           ref={dropAreaRef}
//           className={`flex h-48 max-w-prose cursor-pointer flex-col items-center justify-center border bg-gray-50 text-center text-sm text-gray-600 focus:ring-2 ${isDragging ? 'border-blue-500' : 'border-gray-300'} rounded-md p-4`}
//           onClick={() => document.getElementById('audio_path')?.click()}
//           aria-describedby="audio-error"
//           role="button"
//           tabIndex={0}
//         >
//           {!isUploading && !uploadComplete && (
//             <div className="">Click or drag and drop your audio file here</div>
//           )}
//           {isUploading && !uploadComplete && (
//             <div className="">
//               Audio uploading: {`${percentageUploaded}% complete`}
//             </div>
//           )}
//           {uploadComplete && <div className="">Transcribing audio...</div>}
//           <input
//             id="audio_path"
//             name="audio_path"
//             type="file"
//             accept="audio/mpeg, audio/mp3"
//             onChange={(e) => {
//               if (e.target.files && e.target.files.length > 0) {
//                 handleAudioUpload(e.target.files[0]);
//               }
//             }}
//             className="hidden"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
