'use client'
import React, { useState, useRef } from 'react'
// import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import { Database } from '@/app/database.types'
// import { Button } from '@/app/ui/button'
// import { FileInput } from '@/app/ui/fileInput'
import * as tus from 'tus-js-client'
import { createClient } from '@/utils/supabase/client';


export default function AudioUpload({ 
    
    setRecordingUrl,
    setTempDownloadUrl,
    isUploading,
    setIsUploading,
}: { 
    
    setRecordingUrl: React.Dispatch<React.SetStateAction<string | null>>;
    setTempDownloadUrl: React.Dispatch<React.SetStateAction<string | null>>;
    isUploading: boolean;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
 }) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    
    const [uploadComplete, setUploadComplete] = useState(false)
    const [percentageUploaded, setPercentageUploaded] = useState(0)
    
    // const user = session?.user
    // const userId = user?.id

    // IN PROGRESS
    const supabase = createClient()
    const user = supabase.auth.getUser()
    const userId = user?.id



    async function handleAudioUpload() {
        const fileInput = inputFileRef.current;

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            try {
                setIsUploading(true);
                
                const randomPrefix = Math.floor(Math.random() * 900000) + 100000;
                const fileNameWithPrefix = `${randomPrefix}_${file.name}`

                await uploadFile('apptrecordings', `${fileNameWithPrefix}`, file);

                setIsUploading(false);
            } catch (error) {
                console.error('Error uploading file:', error);
                setIsUploading(false);
            }
        }
    }

    async function getDownloadUrl(fileName: string){
        const { data, error } = await supabase.storage.from('apptrecordings').createSignedUrl(`${userId}/${fileName}`, 600)
        return data?.signedUrl
    }

    async function uploadFile(bucketName: string, fileName: string, file: File) {
        return new Promise((resolve, reject) => {
            const upload = new tus.Upload(file, {
                endpoint: `https://tmmnudhjtavobvreaink.supabase.co/storage/v1/upload/resumable`,
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    authorization: `Bearer ${session?.access_token}`,
                    'x-upsert': 'true',
                },
                uploadDataDuringCreation: true,
                removeFingerprintOnSuccess: true,
                metadata: {
                    bucketName,
                    objectName: `${userId}/${fileName}`,
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

                        setRecordingUrl(`${fileName}`)

                        const signedUrl = await getDownloadUrl(fileName);
                        console.log("signedUrl:", signedUrl);
                        
                        // Check if signedUrl is defined before setting the state
                        if (signedUrl !== undefined) {
                            setTempDownloadUrl(signedUrl);
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
    return (
        <fieldset>
            <legend className="mb-2 block text-sm font-medium">
                Appointment Recording
            </legend>
            
            
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3 h-46">
                <div className="flex flex-col items-left gap-4">
                        <div>Upload a recording of your medical appointment in mp3 format. Max file size: 50 mb / 1 hour.</div>   
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