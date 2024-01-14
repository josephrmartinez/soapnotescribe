'use client'
import React, { useEffect, useState, useRef } from 'react'



export default function AudioUpload(){

    const inputFileRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    
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
