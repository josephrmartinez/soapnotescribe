'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/app/database.types'
import * as tus from 'tus-js-client'

export default function AudioUpload({ session }: { session: Session | null }) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClientComponentClient<Database>();
    const user = session?.user
    const userId = user?.id

    async function handleAudioUpload() {
        const fileInput = inputFileRef.current;

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            try {
                setIsUploading(true);

                await uploadFile('apptrecordings', `${userId}/testuploadfilename`, file);

                setIsUploading(false);
            } catch (error) {
                console.error('Error uploading file:', error);
                setIsUploading(false);
            }
        }
    }

    async function uploadFile(bucketName: string, fileName: string, file: File) {

        return new Promise((resolve, reject) => {
            const upload = new tus.Upload(file, {
                endpoint: `https://tmmnudhjtavobvreaink.supabase.co/storage/v1/upload/resumable`,
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    authorization: `Bearer ${session.access_token}`,
                    'x-upsert': 'true',
                },
                uploadDataDuringCreation: true,
                removeFingerprintOnSuccess: true,
                metadata: {
                    bucketName,
                    objectName: fileName,
                    contentType: file.type,
                    cacheControl: 3600,
                },
                chunkSize: 6 * 1024 * 1024,
                onError: function (error) {
                    console.log('Failed because: ' + error);
                    reject(error);
                },
                onProgress: function (bytesUploaded, bytesTotal) {
                    var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                    console.log(bytesUploaded, bytesTotal, percentage + '%');
                },
                onSuccess: function () {
                    console.log('Download %s from %s', upload.file.name, upload.url);
                    resolve();
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
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                <div className="flex gap-4">
                    <div className="flex items-center">

                        <input
                            id="audio_path"
                            name="audio_path"
                            ref={inputFileRef}
                            aria-describedby='audio-error'
                            type="file"
                            accept="audio/mpeg, audio/mp3"
                            className="cursor-pointer text-sm border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        />
                        <button type="button" className="border p-2 mx-4" onClick={handleAudioUpload}>
                            Upload Audio
                        </button>
                        {isUploading &&
                            <div>audio uploading</div>
                        }

                    </div>

                </div>
            </div>

        </fieldset>
    )
}