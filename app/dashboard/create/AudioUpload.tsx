'use client'
import React, { useState, useRef, useEffect } from 'react'
import * as tus from 'tus-js-client'
import { createClient } from '@/utils/supabase/client';


export default function AudioUpload(
//     { 
//     setRecordingUrl,
//     setTempDownloadUrl,
//     isUploading,
//     setIsUploading,
// }: { 
//     setRecordingUrl: React.Dispatch<React.SetStateAction<string | null>>;
//     setTempDownloadUrl: React.Dispatch<React.SetStateAction<string | null>>;
//     isUploading: boolean;
//     setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
//  }
 ) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [uploadComplete, setUploadComplete] = useState(false)
    const [percentageUploaded, setPercentageUploaded] = useState(0)
    const [userID, setUserID] = useState<string | undefined>("");
    const [accessToken, setAccessToken] = useState<string | undefined>("");

    const [loading, setLoading] = useState(true)
    const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
    const [tempDownloadUrl, setTempDownloadUrl] = useState<string | null>(null)
    const [submitOkay, setSubmitOkay] = useState<boolean>(true)
    const [isUploading, setIsUploading] = useState<boolean>(false);
    
    const supabase = createClient();
    
    useEffect(() => {
        const fetchUser = async () => {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error(error);
          } else {
            setUserID(data.session?.user.id);
            setAccessToken(data.session?.access_token)
          }
        };
    
        fetchUser();
     }, []);

    async function handleAudioUpload() {
        const fileInput = inputFileRef.current;

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            try {
                setIsUploading(true);
                
                const randomPrefix = Math.floor(Math.random() * 900000) + 100000;
                const fileNameWithPrefix = `${randomPrefix}_${file.name}`

                await uploadFile('audiofiles', `${fileNameWithPrefix}`, file);

                setIsUploading(false);
            } catch (error) {
                console.error('Error uploading file:', error);
                setIsUploading(false);
            }
        }
    }

    async function getDownloadUrl(fileName: string){
        const { data, error } = await supabase.storage.from('audiofiles').createSignedUrl(`${userID}/${fileName}`, 600)
        return data?.signedUrl
    }

    
    async function uploadFile(bucketName: string, fileName: string, file: File) {
        return new Promise((resolve, reject) => {
            const upload = new tus.Upload(file, {
                endpoint: `https://grjecfvldxcnvhmjpvmu.supabase.co/storage/v1/upload/resumable`,
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    authorization: `Bearer ${accessToken}`,
                    'x-upsert': 'true',
                },
                uploadDataDuringCreation: true,
                removeFingerprintOnSuccess: true,
                metadata: {
                    bucketName,
                    objectName: `${userID}/${fileName}`,
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
                    setPercentageUploaded(parseFloat(percentage))
                    console.log(bytesUploaded, bytesTotal, percentage + '%');
                },
                onSuccess: async function () {
                    setUploadComplete(true)
                    try {
                        const signedUrl = await getDownloadUrl(fileName);
                        console.log("signedUrl:", signedUrl);
                        
                        // Check if signedUrl is defined before setting the state
                        if (signedUrl !== undefined) {
                            
                            uploadToSupabaseTable(fileName, signedUrl)
                        } else {
                            console.error("Error: Signed URL is undefined");
                        }
                    } catch (error) {
                        console.error("Error fetching signed URL:", error);
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

    async function uploadToSupabaseTable(audio_storage_url: string, temp_audio_url: string){
        try {
            const { error, data } = await supabase.from('appointments').insert({
                user_id: userID as string,
                created_at: new Date().toISOString(),
                audio_storage_url,
                temp_audio_url,
              })
              .select();
              
              console.log("upload return data:", data)

              if (error) {
                console.error("Error inserting into Supabase table:", error)
              }
        } catch (error) {
            console.error("Failed to upload to Supabase table:", error)
        }
        

        
    }
    

    return (
        <fieldset>
            <legend className="mb-2 block text-sm font-medium">
                Appointment Recording
            </legend>
            
            
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3 h-46">
                <div className="flex flex-col items-left gap-4">
                        <div>Upload your appointment memo in mp3 format. Max file size: 50 mb / 1 hour.</div>   
                        <a href='https://cloudconvert.com/' target='_blank' className='underline underline-offset-4 text-gray-600'>Click here if you need to convert your recording to mp3 format.</a>
                        <input
                            id="audio_path"
                            name="audio_path"
                            ref={inputFileRef}
                            aria-describedby='audio-error'
                            type="file"
                            accept="audio/mpeg, audio/mp3"
                            onChange={handleAudioUpload}
                            className="cursor-pointer text-sm border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        />
                </div>
                {isUploading && !uploadComplete &&
                <div className='mt-4'>Audio uploading: {`${percentageUploaded}% complete`}</div>
                }
                {uploadComplete &&
                <div className='mt-4'>Audio upload complete.</div>
                }
            </div>

        </fieldset>
    )
}